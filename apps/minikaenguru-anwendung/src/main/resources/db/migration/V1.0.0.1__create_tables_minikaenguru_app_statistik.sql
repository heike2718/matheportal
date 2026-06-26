use minikaenguru;

create table wettbewerbe (
    jahr int NOT NULL PRIMARY KEY comment 'PK - das Wettbewerbsjahr',
    status varchar(20) NOT NULL comment 'ERFASST, ANMELDUNG, DOWNLOAD_LEHRER, DOWNLOAD_PRIVAT, BEENDET',
    beginn DATE NOT NULL comment 'Datum des Wettbewerbsbeginns, also des Beginns des Anmeldezeitraums',
    ende DATE NOT NULL comment 'Datum des Wettbewerbsendes, also der Vernichtung der personenbezogenen Wettbewerbsdaten',
    freischaltung_schulen DATE NOT NULL comment 'Datum der Freischaltung der Unterlagen für die Schulen',
    freischaltung_privat DATE NOT NULL comment 'Datum der Freischaltung der Unterlagen für die private Veranstalter',
    loesungsbuchstaben_ikid varchar(20) comment 'Lösungsbuchstaben Inklusion, mit - in 3 Gruppen getrennt',
    loesungsbuchstaben_eins varchar(20) comment 'Lösungsbuchstaben Klasse 1, mit - in 3 Gruppen getrennt',
    loesungsbuchstaben_zwei varchar(20) comment 'Lösungsbuchstaben Klasse 2, mit - in 3 Gruppen getrennt',
    median_ikid int comment 'Median Inklusion mal 1000, um Komma zu vermeiden',
    median_eins int comment 'Median Klasse 1 mal 1000, um Komma zu vermeiden',
    median_zwei int comment 'Median Klasse 2 mal 1000, um Komma zu vermeiden',
    created_at DATETIME(6) NOT NULL,
    updated_at DATETIME(6) NOT NULL,
    version int DEFAULT 0 comment 'JPA-Version'
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;


create table farben_wettbewerbe (
   jahr int NOT NULL PRIMARY KEY comment 'PK - das Wettbewerbsjahr',
   background_color varchar(40) NOT NULL comment 'Füllfarbe eines Gebiets in einem Diagramm',
   border_color varchar(40) NOT NULL comment 'Farbe des Randes eines Gebiets in einem Diagramm',
   point_background_color varchar(40) NOT NULL comment 'Farbe eines Datenpunktes im Liniendiagramm',
   point_border_color varchar(40) NOT NULL comment 'Farbe des Randes eines Datenpunktes im Liniendiagramm',
   point_hover_background_color varchar(40) comment 'Farbe eines Datenpunktes im Liniendiagramm beim Hovern',
   point_hover_border_color varchar(40) comment 'Farbe des Randes eines Datenpunktes im Liniendiagramm beim Hovern'
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;


create table laender (
  kuerzel varchar(10) NOT NULL PRIMARY KEY comment 'kürzel für das Land (2stellig) oder Bundesland (5stellig mit Präfix DE-)',
  name varchar(100) NOT NULL,
  created_at DATETIME(6) NOT NULL,
  updated_at DATETIME(6) NOT NULL,
  version int DEFAULT 0 comment 'JPA-Version'
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;


create table orte (
  kuerzel varchar(10) NOT NULL PRIMARY KEY comment 'PK',
  name varchar(100) NOT NULL,
  kuerzel_land varchar(10) NOT NULL comment 'Referenz auf laender',
  created_at DATETIME(6) NOT NULL,
  updated_at DATETIME(6) NOT NULL,
  version int DEFAULT 0 comment 'JPA-Version',
  CONSTRAINT fk_orte_laender FOREIGN KEY (kuerzel_land) REFERENCES laender(kuerzel)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;


create table schulen (
  kuerzel varchar(10) NOT NULL PRIMARY KEY comment 'PK',
  name varchar(100) NOT NULL,
  kuerzel_ort varchar(10) NOT NULL comment 'Referenz auf orte',
  created_at DATETIME(6) NOT NULL,
  updated_at DATETIME(6) NOT NULL,
  version int DEFAULT 0 comment 'JPA-Version',
  CONSTRAINT fk_schulen_orte FOREIGN KEY (kuerzel_ort) REFERENCES orte(kuerzel)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;


CREATE TABLE veranstalter (
    id BIGINT NOT NULL PRIMARY KEY AUTO_INCREMENT comment 'technische ID',
	  user_uuid varchar(36) NOT NULL comment 'uuid des Benutzerkontos im IAM',
    typ varchar(10) NOT NULL comment 'typ des Veranstalters - LEHRER oder PRIVAT',
    teilnahmekuerzel varchar(1000) comment 'kommaseparierte Liste der Kürzel der Schulen oder Kürzel der Privatteilnahme',
	  newsletter tinyint(1) NOT NULL comment 'Flag, ob Veranstalter Newsletter bekommen möchte',
    zugang_unterlagen varchar(10) DEFAULT 'DEFAULT' NOT NULL comment 'Werte: DEFAULT, ERTEILT, ENTZOGEN',
    created_at DATETIME(6) NOT NULL,
    updated_at DATETIME(6) NOT NULL,
    version int DEFAULT 0 comment 'JPA-Version',
    UNIQUE KEY uk_veranstalter_user_uuid (user_uuid)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;

create table schulkollegien (
   id BIGINT NOT NULL PRIMARY KEY AUTO_INCREMENT comment 'far ID',
   kuerzel_schule varchar(8) NOT NULL comment 'Kürzel der Schule',
   user_uuid varchar(36) NOT NULL comment 'uuid eines users aus IAM und damit eines veranstalters hier',
   UNIQUE KEY uk_schulkollegien_1 (kuerzel_schule, user_uuid),
   CONSTRAINT fk_schulkollegien_schulen FOREIGN KEY (kuerzel_schule) REFERENCES schulen(kuerzel)
)  ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;

create table teilnahmen (
    id BIGINT NOT NULL PRIMARY KEY AUTO_INCREMENT comment 'technische ID',
    jahr int NOT NULL comment 'das Wettbewerbsjahr', 
    teilnahmeart varchar(10) NOT NULL comment 'Werte: SCHULE oder PRIVAT',
    teilnahmekuerzel varchar(10) NOT NULL comment 'fachlich eindeutiger Schlüssel - bei Schulteilnahmen das Schulkürzel',
    angemeldet_durch varchar(36) comment 'user_uuid des Veranstalters, der diese Teilnahme eingetragen hat',
    created_at DATETIME(6) NOT NULL,
    version int NOT NULL DEFAULT 0 comment 'JPA-Version',
    UNIQUE KEY uk_teilnahmen_1 (teilnahmeart, teilnahmekuerzel, jahr),
    CONSTRAINT fk_teilnahmen_wettbewerbe FOREIGN KEY (jahr) REFERENCES wettbewerbe(jahr)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;

create table loesungszettel (
    id BIGINT NOT NULL PRIMARY KEY AUTO_INCREMENT comment 'technische ID',
    jahr int NOT NULL comment 'das Wettbewerbsjahr', 
    teilnahmeart varchar(10) NOT NULL comment 'Werte: SCHULE oder PRIVAT',
    teilnahmekuerzel varchar(10) NOT NULL comment 'fachlich eindeutiger Schlüssel - bei Schulteilnahmen das Schulkürzel',
    klassenstufe varchar(4) NOT NULL comment 'IKID, EINS, ZWEI',
    punkte int NOT NULL comment 'erreichte Punkte als ganze Zahl (also mit 100 multipliziert)',
    kaengurusprung int NOT NULL comment 'Länge des Kängurusprungs',
    kuerzel_land varchar(5) comment 'Kürzel des (Bundes-)Landes',
    sprache varchar(3) comment 'Kürzel für die Sprache der Aufgaben',
    quelle varchar(6) NOT NULL comment 'Quelle der Daten aus enum UPLOAD oder ONLINE',
    nutzereingabe varchar(100) comment 'das, was der Ersteller des Lösungszettels eingegeben hat, also ABCDEN oder frn',
    antwortcode varchar(15) comment 'lückenlose Aneinanderreihung aller vom Kind gesetzten Antwortbuchstaben A-E oder N. 15 für Klasse 2, 12 für Klasse 1',
    wertungscode varchar(15) NOT NULL comment 'lückenlose Aneinanderreihung der Bewertung des Antwortcodes f,n oder r. 15 für Klasse 2, 12 für Klasse 1, 6 für IKids',
    typo tinyint(1) NOT NULL comment 'Flag, ob dieser Lösungszettel einen Typo enthielt',
    created_at DATETIME(6) NOT NULL,
    updated_at DATETIME(6) NOT NULL,
    kind_id varchar(36) comment 'referenz auf KINDER.UUID',
    version int DEFAULT 0 comment 'JPA-Version',
    UNIQUE KEY uk_loesungszettel_1 (jahr, teilnahmeart, teilnahmekuerzel, klassenstufe, kind_id),
    CONSTRAINT fk_loesungszettel_laender FOREIGN KEY (kuerzel_land) REFERENCES laender(kuerzel),
    CONSTRAINT fk_loesungszettel_wettbewerbe FOREIGN KEY (jahr) REFERENCES wettbewerbe(jahr)
  ) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;

create table klassen (
    uuid varchar(36) NOT NULL PRIMARY KEY comment 'technische ID',
    kuerzel_schule varchar(36) NOT NULL comment 'semantische Referenz auf das kuerzel der zugehörigen Schule',
    name varchar(55) NOT NULL comment 'Name der Klasse für die Urkunde',
    created_at DATETIME(6) NOT NULL,
    updated_at DATETIME(6) NOT NULL,
    version int DEFAULT 0 comment 'JPA-Version',
    UNIQUE KEY uk_klassen_1 (kuerzel_schule, name),
    CONSTRAINT fk_klassen_schulen FOREIGN KEY (kuerzel_schule) REFERENCES schulen(kuerzel)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;

create table kinder (
    uuid varchar(36) NOT NULL PRIMARY KEY comment 'technische ID',
    teilnahmeart varchar(10) NOT NULL comment 'Werte: SCHULE oder PRIVAT',
    teilnahmekuerzel varchar(10) NOT NULL comment 'fachlich eindeutiger Schlüssel - bei Schulteilnahmen das Schulkürzel',
    klassenstufe varchar(4) NOT NULL comment 'aus enum IKID, EINS, ZWEI',
    sprache varchar(3) NOT NULL comment 'Kürzel für die Sprache der Aufgaben',
    vorname varchar(55) NOT NULL comment 'der Vorname ist Pflicht, erscheint auf der Urkunde',
    nachname varchar(55) comment 'der Nachname ist optional',
    zusatz varchar(55) comment 'optionale Zusatzangabe für das Kind, erscheint nicht auf der Urkunde',
    kuerzel_land varchar(5) comment 'Kürzel des (Bundes-)Landes',
    klassenstufe_pruefen tinyint(1) NOT NULL DEFAULT 0 comment 'Flag 0/1  - 1, wenn Klassenstufe aus Importdatei nicht eindeutig ermittelt werden konnte' ,
    dublette_pruefen tinyint(1) NOT NULL DEFAULT 0 COMMENT 'Flag 0/1  - 1, wenn die Importdatei Dubletten erzeugt hat',
    importiert tinyint(1) NOT NULL DEFAULT 0 COMMENT 'Flag 0/1  - 1, wenn Kind durch Import erstellt',
    klasse_uuid varchar(36) comment 'Referenz auf klassen, falls Teilnahme über Schule',    
    loesungszettel_id bigint comment 'Referenz auf loesungszettel',
    created_at DATETIME(6) NOT NULL,
    updated_at DATETIME(6) NOT NULL,
    version int DEFAULT 0 comment 'JPA-Version',
    CONSTRAINT fk_kinder_klassen FOREIGN KEY (klasse_uuid) REFERENCES klassen (uuid) on delete cascade,
    CONSTRAINT fk_kinder_laender FOREIGN KEY (kuerzel_land) REFERENCES laender(kuerzel)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;

create table downloads (
    id BIGINT NOT NULL PRIMARY KEY AUTO_INCREMENT comment 'technische ID',
    user_uuid varchar(36) NOT NULL comment 'uuid des Benutzers im IAM',
    jahr int NOT NULL comment 'das Wettbewerbsjahr',
    download_type varchar(30) NOT NULL comment 'aus enum Downloadtyp - verweist auf das heruntergeladene File',
    anzahl int NOT NULL comment 'Anzahl der Downloads für dieses File',
    created_at DATETIME(6) NOT NULL,
    updated_at DATETIME(6) NOT NULL,
    version int DEFAULT 0 comment 'JPA-Version',
    UNIQUE KEY uk_downloads_1 (user_uuid, jahr, download_type)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;

create table uploads (
  id BIGINT NOT NULL PRIMARY KEY AUTO_INCREMENT comment 'technische ID',
  user_uuid varchar(36) NOT NULL comment 'uuid des Benutzers im IAM',
  teilnahmekuerzel varchar(36) NOT NULL comment 'semantische Referenz auf das kuerzel der zugehörigen Teilnahme (Schule)',
  dateiname varchar(150) NOT NULL comment 'Name, die der Datei durch den Lehrer gegeben wurde',
  upload_type varchar(15) NOT NULL comment 'AUSWERTUNG oder KLASSENLISTE',
  charset varchar(15) comment 'falls es sich ermitteln ließ, dann das Charset der hochgeladenen Datei, sonst null',
  status varchar(15) NOT NULL comment 'UploadStatus der Datei: HOCHGELADEN, IMPORTIERT, LEER, FEHLER',
  mediatype varchar(200) NOT NULL comment 'durch TIKA ermittelter MediaType',
  checksumme bigint NOT NULL comment 'Checksumme, um Doppeluploads zu vermeiden',
  upload_date DATETIME(6) NOT NULL comment 'Datum des uploads',
  UNIQUE KEY uk_uploads_1 (user_uuid, checksumme, teilnahmekuerzel)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;

create table events (
    id BIGINT NOT NULL PRIMARY KEY AUTO_INCREMENT comment 'technische ID',
    name varchar(100) NOT NULL comment 'name des events - semantik',
    created_at DATETIME(6) NOT NULL,
    body JSON,
    CHECK (JSON_VALID(body))
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;

create table vertraege_adv_texte (
    uuid varchar(36) NOT NULL PRIMARY KEY comment 'technische ID',
    versionsnummer varchar(20) NOT NULL comment 'eine Version',
    dateiname varchar(150) NOT NULL comment 'beispiel adv-vereinbarung-1.0.pdf',
    checksumme varchar(128) NOT NULL comment 'checksumme der pdf-Datei um zu beweisen, dass genau diese Datei unterzeichnet wurde',
    created_at DATETIME(6) NOT NULL,
    updated_at DATETIME(6) NOT NULL,
    version int DEFAULT 0 comment 'JPA-Version',
    UNIQUE KEY uk_vertraege_adv_texte_1 (versionsnummer),
    UNIQUE KEY uk_vertraege_adv_texte_2 (dateiname)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;

create table vertraege_adv (
    uuid varchar(36) NOT NULL PRIMARY KEY comment 'technische ID',
    vertrag_adv_text_uuid varchar(36) NOT NULL comment 'Referenz auf die Vertragstext-Metadaten',
    kuerzel_schule varchar(8) NOT NULL comment 'Referenz auf die Schule',
    schulname varchar(100) NOT NULL comment 'Name der Schule, die in das Formular eingetragen wurde',
    strasse varchar(100) NOT NULL,
    hausnr varchar(10) NOT NULL,
    plz varchar(10) NOT NULL,
    ort varchar(100) NOT NULL,
    laendercode varchar(2) NOT NULL,
    abgeschlossen_am varchar(19) NOT NULL comment 'Datum und Uhrzeit im deutschen Format, also dd.MM.yyyy hh:mm:ss',
    abgeschlossen_durch varchar(36) NOT NULL comment 'uuid des Benutzers im IAM',
    created_at DATETIME(6) NOT NULL,
    updated_at DATETIME(6) NOT NULL,
    version int DEFAULT 0 comment 'JPA-Version',
    UNIQUE KEY uk_vertraege_adv_1 (kuerzel_schule),
    CONSTRAINT fk_vertraege_adv_vertraege_adv_texte FOREIGN KEY (vertrag_adv_text_uuid) REFERENCES vertraege_adv_texte (uuid),
    CONSTRAINT fk_vertraege_adv_schulen FOREIGN KEY (vertrag_adv_text_uuid) REFERENCES vertraege_adv_texte (uuid)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;

create table scores_klassenstufen (
    id BIGINT NOT NULL PRIMARY KEY AUTO_INCREMENT comment 'technische ID',
    jahr int NOT NULL comment 'Wettbewerbsjahr',
    klassenstufe varchar(4) NOT NULL comment 'IKID, EINS, ZWEI',
    kuerzel_land varchar(5) comment 'Kürzel des (Bundes-)Landes',
    spass int NOT NULL comment 'Spaßfaktor für Kinder: 0 = keine Bewertung, dann aufsteigend bis 5',
    zufriedenheit int NOT NULL comment 'Zufriedenheit Lehrperson mit Wettbewerb: 0 = keine Bewertung, dann aufsteigend bis 5',
    created_at DATETIME(6) NOT NULL,
    freitext varchar(500) comment 'Kommentar zum Wettbewerb',
    CONSTRAINT fk_scores_klassenstufen_wettbewerbe FOREIGN KEY (jahr) REFERENCES wettbewerbe (jahr) ON DELETE CASCADE,
    CONSTRAINT fk_scores_klassenstufen_laender FOREIGN KEY (kuerzel_land) REFERENCES laender(kuerzel)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;

create table scores_aufgaben (
  id BIGINT NOT NULL PRIMARY KEY AUTO_INCREMENT comment 'technische ID',
  score_klassenstufe_id BIGINT NOT NULL comment 'Referenz auf scores_klassenstufen',
  aufgabe_nummer varchar(3) NOT NULL comment 'Nummer der Aufgabe von A-1 bis C-5',
  schwierigkeitsgrad int NOT NULL comment 'Schwierigkeitsgrad in Bezug auf tatsächliche Aufgabenkategorie aufsteigend',
  kategorie varchar(10) comment 'welche Aufgabenkategorie als angemessen erachtet wird: LEICHT, MITTEL, SCHWER',
  verstaendlichkeit int NOT NULL comment 'Verständlichkeit der Aufgabe: 0 = keine Bewertung, -1: nicht verständlich, 1 - verständlich',
  lehrplan int NOT NULL comment 'Passung mit Lehrplan Aufgabe: 0 = keine Bewertung, -1: unbekannte Lehrplaninhalte, 1 - passt zum Lehrplan',
  created_at DATETIME(6) NOT NULL,
  freitext varchar(500) comment 'Kommentar zum Wettbewerb',
  CONSTRAINT fk_scores_aufgaben_scores_klassenstufen FOREIGN KEY (score_klassenstufe_id) REFERENCES scores_klassenstufen (id) ON DELETE CASCADE
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;


