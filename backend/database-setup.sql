-- Script SQL pour créer la base de données WorkshopTwin
-- À exécuter dans phpMyAdmin (XAMPP) ou MySQL

-- Créer la base de données si elle n'existe pas
CREATE DATABASE IF NOT EXISTS workshoptwin CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Utiliser la base de données
USE workshoptwin;

-- Note: Les tables seront créées automatiquement par Hibernate/JPA
-- grâce à la configuration: spring.jpa.hibernate.ddl-auto=update
-- Ce script est optionnel, mais peut être utilisé pour pré-créer la base de données

-- Vérification (optionnel)
SHOW DATABASES LIKE 'workshoptwin';

