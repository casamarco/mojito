package com.box.l10n.mojito.rest.entity;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import java.util.LinkedHashSet;
import java.util.Set;

public class ScreenshotRun {

    private Repository repository;

    @JsonDeserialize(as=LinkedHashSet.class)
    Set<Screenshot> screenshots = new LinkedHashSet<>();

    public Repository getRepository() {
        return repository;
    }

    public void setRepository(Repository repository) {
        this.repository = repository;
    }

    public Set<Screenshot> getScreenshots() {
        return screenshots;
    }

    public void setScreenshots(Set<Screenshot> screenshots) {
        this.screenshots = screenshots;
    }

}
