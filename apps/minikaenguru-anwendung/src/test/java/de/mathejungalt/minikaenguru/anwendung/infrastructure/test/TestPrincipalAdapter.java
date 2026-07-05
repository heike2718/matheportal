package de.mathejungalt.minikaenguru.anwendung.infrastructure.test;

import java.security.Principal;

/**
 * TestPrincipalAdapter
 */
public class TestPrincipalAdapter implements Principal {

    private final String name;

    public TestPrincipalAdapter(final String name) {
        super();
        this.name = name;
    }

    @Override
    public String getName() {
        return this.name;
    }

}
