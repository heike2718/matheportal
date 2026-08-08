package de.mathejungalt.minikaenguru.dbmigration;

import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import io.quarkus.runtime.QuarkusApplication;
import io.quarkus.runtime.annotations.QuarkusMain;

/**
 * DbMigrationApplication.
 */
@QuarkusMain
public class DbMigrationApplication implements QuarkusApplication {

    private static final Logger LOGGER = LoggerFactory.getLogger(DbMigrationApplication.class);

    @ConfigProperty(name = "quarkus.datasource.jdbc.url")
    String jdbcUrl;

    @Override
    public int run(final String... args) {
        LOGGER.info(" ===========>  jdbcUrl={}", jdbcUrl);
        return 0;
    }

}
