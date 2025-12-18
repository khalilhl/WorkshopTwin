# 🗄️ Configuration MySQL avec XAMPP - Guide de Configuration

## 📋 Prérequis

1. **XAMPP installé** sur votre machine
2. **MySQL démarré** dans XAMPP Control Panel
3. **Java 17** installé
4. **Maven** installé (ou utiliser l'IDE)

## 🚀 Étapes de Configuration

### 1. Démarrer XAMPP

1. Ouvrir **XAMPP Control Panel**
2. Cliquer sur **Start** pour le service **MySQL**
3. Vérifier que MySQL est en cours d'exécution (fond vert)

### 2. Créer la Base de Données

#### Option A : Via phpMyAdmin (Recommandé)

1. Ouvrir votre navigateur
2. Aller sur : http://localhost/phpmyadmin
3. Cliquer sur l'onglet **"SQL"**
4. Coller ce script :
   ```sql
   CREATE DATABASE IF NOT EXISTS workshoptwin CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```
5. Cliquer sur **"Exécuter"**

#### Option B : Via la ligne de commande MySQL

1. Ouvrir le terminal/CMD
2. Aller dans le dossier XAMPP MySQL :
   ```bash
   cd C:\xampp\mysql\bin
   ```
3. Se connecter à MySQL :
   ```bash
   mysql -u root -p
   ```
   (Laissez le mot de passe vide si vous n'en avez pas configuré)
4. Exécuter :
   ```sql
   CREATE DATABASE IF NOT EXISTS workshoptwin CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   USE workshoptwin;
   EXIT;
   ```

#### Option C : Via le script fourni

Le fichier `database-setup.sql` contient le script SQL. Vous pouvez l'importer via phpMyAdmin :
1. Ouvrir phpMyAdmin : http://localhost/phpmyadmin
2. Cliquer sur l'onglet **"Importer"**
3. Sélectionner le fichier `database-setup.sql`
4. Cliquer sur **"Exécuter"**

### 3. Vérifier les Paramètres MySQL

**Par défaut, XAMPP configure MySQL avec :**
- **Host** : `localhost`
- **Port** : `3306`
- **Username** : `root`
- **Password** : (vide par défaut)

Si vous avez modifié le mot de passe root, vous devez mettre à jour `application.properties` :
```properties
spring.datasource.password=votre_mot_de_passe
```

### 4. Configuration Spring Boot

Le fichier `application.properties` est déjà configuré pour MySQL avec :
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/workshoptwin?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=
```

**Note** : Si vous avez un mot de passe pour MySQL, modifiez la ligne `spring.datasource.password=`

### 5. Démarrer l'Application Spring Boot

1. Aller dans le dossier backend :
   ```bash
   cd backend
   ```

2. Compiler et démarrer (si Maven est installé) :
   ```bash
   mvn clean install
   mvn spring-boot:run
   ```

   Ou depuis votre IDE (IntelliJ IDEA, Eclipse, etc.) :
   - Clic droit sur `WorkshopTwinApplication.java`
   - Run 'WorkshopTwinApplication'

### 6. Vérifier que ça fonctionne

L'application va :
- ✅ Se connecter automatiquement à MySQL
- ✅ Créer les tables automatiquement (grâce à `ddl-auto=update`)
- ✅ Insérer les données initiales (grâce à `DataInitializer`)

**Vérification** :
1. Ouvrir phpMyAdmin : http://localhost/phpmyadmin
2. Sélectionner la base `workshoptwin`
3. Vérifier que les tables suivantes existent :
   - `events`
   - `participations`
   - `users`
   - `event_domaines`

## 🔍 Vérification des Données

### Via phpMyAdmin

1. Ouvrir : http://localhost/phpmyadmin
2. Sélectionner la base `workshoptwin`
3. Cliquer sur la table `events` → Voir les données
4. Cliquer sur la table `participations` → Voir les tickets/réservations

### Via l'API REST

Tester les endpoints :
- `GET http://localhost:8081/api/events` : Liste des événements
- `GET http://localhost:8081/api/participations/user/1` : Tickets de l'utilisateur #1

## ⚠️ Problèmes Courants

### Erreur : "Access denied for user 'root'@'localhost'"

**Solution** :
1. Vérifier que MySQL est démarré dans XAMPP
2. Vérifier le mot de passe dans `application.properties`
3. Réinitialiser le mot de passe MySQL si nécessaire

### Erreur : "Unknown database 'workshoptwin'"

**Solution** :
1. Créer la base de données manuellement (voir étape 2)
2. Ou l'URL contient `createDatabaseIfNotExist=true`, donc ça devrait se créer automatiquement

### Erreur : "Communications link failure"

**Solution** :
1. Vérifier que MySQL est démarré dans XAMPP
2. Vérifier que le port 3306 n'est pas utilisé par un autre service
3. Vérifier la connexion : `mysql -u root -p -h localhost`

### Les tables ne sont pas créées

**Solution** :
1. Vérifier que `spring.jpa.hibernate.ddl-auto=update` est présent
2. Vérifier les logs Spring Boot pour les erreurs
3. Vérifier que la connexion MySQL fonctionne

## 📊 Structure de la Base de Données

Les tables seront créées automatiquement par Hibernate/JPA :

### Table `events`
- `id` (BIGINT, PRIMARY KEY)
- `title` (VARCHAR)
- `description` (VARCHAR)
- `date` (DATE)
- `place` (VARCHAR)
- `price` (FLOAT)
- `organizer_id` (BIGINT)
- `image_url` (VARCHAR)
- `nb_places` (INTEGER)
- `nb_likes` (INTEGER)

### Table `participations`
- `id` (BIGINT, PRIMARY KEY)
- `user_id` (BIGINT)
- `event_id` (BIGINT)
- `email_participant` (VARCHAR)
- `nb_places` (INTEGER)
- `status` (VARCHAR) : CONFIRMED, PENDING, CANCELLED
- `registration_date` (TIMESTAMP)

### Table `users`
- `id` (BIGINT, PRIMARY KEY)
- `username` (VARCHAR, UNIQUE)
- `email` (VARCHAR, UNIQUE)
- `password` (VARCHAR)
- `role` (VARCHAR)

### Table `event_domaines`
- `event_id` (BIGINT)
- `domaine` (VARCHAR)

## ✅ Vérification Finale

1. ✅ MySQL démarré dans XAMPP
2. ✅ Base de données `workshoptwin` créée
3. ✅ Spring Boot démarre sans erreur
4. ✅ Les tables sont créées dans phpMyAdmin
5. ✅ Les données initiales sont insérées (événements)
6. ✅ L'API répond correctement

## 🔄 Migration depuis H2

Si vous aviez des données dans H2 :
- ❌ **Les données H2 sont perdues** (base en mémoire)
- ✅ Les données seront stockées de manière **persistante** dans MySQL
- ✅ Les données survivront aux redémarrages du serveur

## 📝 Notes Importantes

- Les données sont maintenant **persistantes** dans MySQL
- Les données **ne seront plus perdues** au redémarrage
- Vous pouvez faire des **backups** via phpMyAdmin
- Les données seront visibles dans **phpMyAdmin** en temps réel

## 🆘 Support

Si vous rencontrez des problèmes :
1. Vérifier les logs Spring Boot dans la console
2. Vérifier les erreurs MySQL dans XAMPP Control Panel
3. Vérifier que tous les services XAMPP nécessaires sont démarrés

