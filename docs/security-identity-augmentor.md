# SecurityIdendity anreichern

```java
import io.quarkus.security.identity.AuthenticationRequestContext;
import io.quarkus.security.identity.SecurityIdentity;
import io.quarkus.security.identity.SecurityIdentityAugmentor;
import io.quarkus.security.runtime.QuarkusSecurityIdentity;
import io.smallrye.mutiny.Uni;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class MinikaenguruSecurityIdentityAugmentor implements SecurityIdentityAugmentor {

    @Override
    public Uni<SecurityIdentity> augment(SecurityIdentity identity, AuthenticationRequestContext context) {
        if (identity.isAnonymous()) {
            return Uni.createFrom().item(identity);
        }

        String sub = identity.getPrincipal().getName(); // nur wenn dein Principal-Name tatsächlich das sub ist

        return context.runBlocking(() -> {
            Veranstalter veranstalter = veranstalterRepository.findByUserUuid(sub);

            QuarkusSecurityIdentity.Builder builder = QuarkusSecurityIdentity.builder(identity);

            if (veranstalter != null) {
                builder.addRole("VERANSTALTER");

                switch (veranstalter.typ()) {
                    case LEHRER -> builder.addRole("LEHRER");
                    case PRIVAT -> builder.addRole("PRIVAT");
                }

                builder.addAttribute("veranstalter", veranstalter);
                builder.addAttribute("veranstalterTyp", veranstalter.typ().name());
                builder.addAttribute("schuleId", veranstalter.schuleId());
            }

            return builder.build();
        });
    }
}
```

damit dann

```java
@Inject
SecurityIdentity securityIdentity;

String modifiedBy() {
    return securityIdentity.getPrincipal().getName();
}
```

und

```java
String veranstalterTyp = securityIdentity.getAttribute("veranstalterTyp");
```
