package com.box.l10n.mojito.service.screenshot;

import com.box.l10n.mojito.entity.Screenshot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

/**
 * @author jaurambault
 */
@RepositoryRestResource(exported = false)
public interface ScreenshotRepository extends JpaRepository<Screenshot, Long>, JpaSpecificationExecutor<Screenshot> {
    
}
