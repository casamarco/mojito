package com.box.l10n.mojito.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.ForeignKey;
import javax.persistence.Index;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import org.hibernate.envers.Audited;
import org.hibernate.envers.RelationTargetAuditMode;

/**
 * Contains the list of text unit names associated with a screenshot
 *
 * @author aloison
 */
@Entity
@Audited(targetAuditMode = RelationTargetAuditMode.NOT_AUDITED)
@Table(
        name = "screenshot_text_unit_name"        ,
        indexes = {
            @Index(name = "I__SCREENSHOT_TEXT_UNIT__NAME", columnList = "name", unique = true)
        }
)
public class ScreenshotTextUnit extends BaseEntity {

    @ManyToOne
    @JsonBackReference
    @JoinColumn(name = "screenshot_id", foreignKey = @ForeignKey(name = "FK__SCREENSHOT_TEXT_UNIT_NAME__SCREENSHOT__ID"), nullable = false)
    private Screenshot screenshot;

    @Column(name = "name", length = Integer.MAX_VALUE)
    private String name;

    @Column(name = "source", length = Integer.MAX_VALUE)
    private String source;

    @Column(name = "target", length = Integer.MAX_VALUE)
    private String target;
    
    public Screenshot getScreenshot() {
        return screenshot;
    }

    public void setScreenshot(Screenshot screenshot) {
        this.screenshot = screenshot;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }

    public String getTarget() {
        return target;
    }

    public void setTarget(String target) {
        this.target = target;
    }
}
