package com.box.l10n.mojito.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import java.util.LinkedHashSet;
import java.util.Set;
import javax.persistence.Basic;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.ForeignKey;
import javax.persistence.Index;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;

/**
 * Represents a screenshot.
 *
 *
 * @author jaurambault
 */
@Entity
@Table(name = "screenshot",
        indexes = {
            @Index(name = "UK__SCREENSHOT__NAME__SCREENSHOT_RUN_ID", columnList = "name, screenshot_run_id", unique = true)
        }
)
public class Screenshot extends SettableAuditableEntity {

    public enum Status {
        REJECTED,
        NEEDS_REVIEW,
        ACCEPTED;
    };

    @Column(name = "name", length = Integer.MAX_VALUE)
    private String name;

    @JsonIgnoreProperties({"repository", "screenshots", "createdDate"})
    @Basic(optional = false)
    @ManyToOne
    @JoinColumn(name = "screenshot_run_id", foreignKey = @ForeignKey(name = "FK__SCREENSHOT__SCREENSHOT_RUN__ID"))
    private ScreenshotRun screenshotRun;

    @Basic(optional = false)
    @ManyToOne
    @JoinColumn(name = "locale_id", foreignKey = @ForeignKey(name = "FK__SCREENSHOT__LOCALE__ID"))
    private Locale locale;

    @Column(name = "src", length = Integer.MAX_VALUE)
    private String src;

    @Column(name = "status", length = 32)
    @Enumerated(EnumType.STRING)
    private Status status = Status.NEEDS_REVIEW;

    @Column(name = "sequence")
    private Long sequence;

    @Column(name = "md5", length = 32)
    private String md5;

    @Column(name = "perceptualHash", length = 32)
    private String perceptualHash;

    @Column(name = "comment", length = Integer.MAX_VALUE)
    private String comment;

    @JsonManagedReference
    @OneToMany(mappedBy = "screenshot", fetch = FetchType.EAGER)
    @JsonProperty("textUnits")
    @JsonDeserialize(as = LinkedHashSet.class)
    Set<ScreenshotTextUnit> screenshotTextUnits = new LinkedHashSet<>();

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Locale getLocale() {
        return locale;
    }

    public void setLocale(Locale locale) {
        this.locale = locale;
    }

    public String getSrc() {
        return src;
    }

    public void setSrc(String src) {
        this.src = src;
    }

    public String getMd5() {
        return md5;
    }

    public void setMd5(String md5) {
        this.md5 = md5;
    }

    public String getPerceptualHash() {
        return perceptualHash;
    }

    public void setPerceptualHash(String perceptualHash) {
        this.perceptualHash = perceptualHash;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public ScreenshotRun getScreenshotRun() {
        return screenshotRun;
    }

    public void setScreenshotRun(ScreenshotRun screenshotRun) {
        this.screenshotRun = screenshotRun;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public Set<ScreenshotTextUnit> getScreenshotTextUnits() {
        return screenshotTextUnits;
    }

    public void setScreenshotTextUnits(Set<ScreenshotTextUnit> screenshotTextUnits) {
        this.screenshotTextUnits = screenshotTextUnits;
    }

    public Long getSequence() {
        return sequence;
    }

    public void setSequence(Long sequence) {
        this.sequence = sequence;
    }

}
