package com.box.l10n.mojito.rest.screenshot;

import com.box.l10n.mojito.entity.Screenshot;
import com.box.l10n.mojito.entity.ScreenshotRun;
import com.box.l10n.mojito.service.screenshot.ScreenshotService;
import java.util.ArrayList;
import java.util.List;
import org.slf4j.Logger;
import static org.slf4j.LoggerFactory.getLogger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author wyau
 */
@RestController
public class ScreenshotWS {

    /**
     * logger
     */
    static Logger logger = getLogger(ScreenshotWS.class);

    @Autowired
    ScreenshotService screenshotService;

    @RequestMapping(value = "/api/screenshots", method = RequestMethod.POST)
    public ScreenshotRun  createScreenshotRun(@RequestBody ScreenshotRun screenshotRun) {
        ScreenshotRun createScreenshotRun = screenshotService.createScreenshotRun(screenshotRun);
        return createScreenshotRun;
    }

    @RequestMapping(value = "/api/screenshots", method = RequestMethod.GET)
    public List<Screenshot> getScreeenshots(
            @RequestParam(value = "repositoryIds[]", required = false) ArrayList<Long> repositoryIds,
            @RequestParam(value = "bcp47Tags[]", required = false) ArrayList<String> bcp47Tags,
            @RequestParam(required = false) String screenshotName,
            @RequestParam(required = false) Screenshot.Status status,
            @RequestParam(value = "limit", required = false, defaultValue = "10") Integer limit,
            @RequestParam(value = "offset", required = false, defaultValue = "0") Integer offset) {
       
        return screenshotService.searchScreenshots(
                repositoryIds, 
                bcp47Tags, 
                screenshotName, 
                status,
                limit,
                offset);
    }

    @RequestMapping(value = "/api/screenshots/{id}", method = RequestMethod.PUT)
    public void updateScreenshot(@PathVariable Long id, @RequestBody Screenshot screenshot) {
        screenshot.setId(id);
        screenshotService.updateScreenshot(screenshot);
    }

}