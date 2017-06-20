package com.box.l10n.mojito.service.screenshot;

import com.box.l10n.mojito.entity.Locale;
import com.box.l10n.mojito.entity.Locale_;
import com.box.l10n.mojito.entity.Repository;
import com.box.l10n.mojito.entity.Repository_;
import com.box.l10n.mojito.entity.Screenshot;
import com.box.l10n.mojito.entity.ScreenshotRun;
import com.box.l10n.mojito.entity.ScreenshotRun_;
import com.box.l10n.mojito.entity.ScreenshotTextUnit;
import com.box.l10n.mojito.entity.Screenshot_;
import com.box.l10n.mojito.service.tm.search.TextUnitDTO;
import com.box.l10n.mojito.service.tm.search.TextUnitSearcher;
import com.box.l10n.mojito.service.tm.search.TextUnitSearcherParameters;
import com.google.common.base.Strings;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Join;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.comparator.NullSafeComparator;

/**
 * Service to manage screenshots.
 *
 * @author jeanaurambault
 */
@Service
public class ScreenshotService {

    /**
     * logger
     */
    static Logger logger = LoggerFactory.getLogger(ScreenshotService.class);

    @Autowired
    ScreenshotRunRepository screenshotRunRepository;

    @Autowired
    ScreenshotRepository screenshotRepository;

    @Autowired
    ScreenshotTextUnitRepository screenshotTextUnitRepository;

    @Autowired
    TextUnitSearcher textUnitSearcher;

    @Autowired
    EntityManager em;

    @Transactional
    public ScreenshotRun createScreenshotRun(ScreenshotRun screenshotRun) {

        Repository repository = screenshotRun.getRepository();
        logger.debug("Create a screenshot run for repository: {}", repository.getName());
        screenshotRun = screenshotRunRepository.save(screenshotRun);

        logger.debug("Start saving screenshot ordered by sequence");
        List<Screenshot> screenshots = new ArrayList<>(screenshotRun.getScreenshots());
        sortScreenshotBySequence(screenshots);

        for (Screenshot screenshot : screenshots) {
            completeAndSaveScreenshot(screenshot, screenshotRun);
        }

        logger.debug("Update the last successful screenshot import");
        updateLastSucessfulScreenshotRun(repository, screenshotRun);
        return screenshotRun;
    }

    void sortScreenshotBySequence(List<Screenshot> screenshots) {

        Collections.sort(screenshots, new Comparator<Screenshot>() {
            @Override
            public int compare(Screenshot o1, Screenshot o2) {
                return NullSafeComparator.NULLS_HIGH.compare(o1.getSequence(), o2.getSequence());
            }
        });
    }

    void updateLastSucessfulScreenshotRun(Repository repository, ScreenshotRun screenshotRun) {

        ScreenshotRun lastSuccesfulRun = screenshotRunRepository.findByRepositoryAndLastSuccessfulRunIsTrue(repository);

        if (lastSuccesfulRun != null) {
            lastSuccesfulRun.setLastSuccessfulRun(Boolean.FALSE);
        }

        screenshotRun.setLastSuccessfulRun(Boolean.TRUE);
    }

    void completeAndSaveScreenshot(Screenshot screenshot, ScreenshotRun screenshotRun) {
        screenshot.setScreenshotRun(screenshotRun);
        screenshot = screenshotRepository.save(screenshot);

        for (ScreenshotTextUnit screenshotTextUnit : screenshot.getScreenshotTextUnits()) {
            completeAndSaveScreenshotTextUnit(screenshotTextUnit, screenshot);
        }
    }

    /**
     * Get the source and target from the database from the screenshot text unit
     * name. This can get out of sync.
     *
     * An improvement would be to get them during extraction for more
     * consistency and actually show the fully translated string.
     *
     * @param screenshotTextUnit
     * @param screenshot
     */
    void completeAndSaveScreenshotTextUnit(ScreenshotTextUnit screenshotTextUnit, Screenshot screenshot) {
        screenshotTextUnit.setScreenshot(screenshot);

        TextUnitDTO textUnitForName = getTextUnitForName(screenshot.getScreenshotRun().getRepository().getId(),
                screenshotTextUnit.getName(),
                screenshot.getLocale().getId());

        if (textUnitForName != null) {
            screenshotTextUnit.setSource(textUnitForName.getSource());
            screenshotTextUnit.setTarget(textUnitForName.getTarget());
        }
        screenshotTextUnitRepository.save(screenshotTextUnit);
    }

    TextUnitDTO getTextUnitForName(Long repositoryId, String screenshotTextUnitName, Long localeId) {

        TextUnitDTO textUnitDTO = null;

        TextUnitSearcherParameters textUnitSearcherParameters = new TextUnitSearcherParameters();
        textUnitSearcherParameters.setRepositoryIds(repositoryId);
        textUnitSearcherParameters.setName(screenshotTextUnitName);
        textUnitSearcherParameters.setLocaleId(localeId);

        List<TextUnitDTO> textUnitDTOs = textUnitSearcher.search(textUnitSearcherParameters);

        if (!textUnitDTOs.isEmpty()) {
            textUnitDTO = textUnitDTOs.get(0);
        }

        return textUnitDTO;
    }

    @Transactional
    public List<Screenshot> searchScreenshots(
            List<Long> repositoryIds,
            List<String> bcp47Tags,
            String screenshotName,
            Screenshot.Status status,
            int limit,
            int offset) {

        CriteriaBuilder builder = em.getCriteriaBuilder();
        CriteriaQuery<Screenshot> query = builder.createQuery(Screenshot.class);
        Root<Screenshot> screenshot = query.from(Screenshot.class);
        Join<Screenshot, ScreenshotRun> screenshotRunJoin = screenshot.join(Screenshot_.screenshotRun);
        Join<ScreenshotRun, Repository> repositoryJoin = screenshotRunJoin.join(ScreenshotRun_.repository);
        Join<Screenshot, Locale> localeJoin = screenshot.join(Screenshot_.locale);

        Predicate conjunction = builder.conjunction();

        conjunction.getExpressions().add(builder.isTrue(screenshotRunJoin.get(ScreenshotRun_.lastSuccessfulRun)));

        if (repositoryIds != null) {
            conjunction.getExpressions().add(repositoryJoin.get(Repository_.id).in(repositoryIds));
        }

        if (bcp47Tags != null) {
            conjunction.getExpressions().add(localeJoin.get(Locale_.bcp47Tag).in(bcp47Tags));
        }

        if (!Strings.isNullOrEmpty(screenshotName)) {
            Predicate predicate = builder.equal(screenshot.get(Screenshot_.name), screenshotName);
            conjunction.getExpressions().add(predicate);
        }

        if (status != null) {
            Predicate predicate = builder.equal(screenshot.get(Screenshot_.status), status);
            conjunction.getExpressions().add(predicate);
        }

        query.where(conjunction);

        List<Screenshot> screenshots = em.createQuery(query.select(screenshot)).setFirstResult(offset).setMaxResults(limit).getResultList();
        return screenshots;
    }

    /**
     * Upades the screenshot
     *
     * @param screenshot screenshot to be updated
     */
    public void updateScreenshot(Screenshot screenshot) {
        screenshotRepository.save(screenshot);
    }

}
