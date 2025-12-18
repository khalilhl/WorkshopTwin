package com.workshoptwin.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "events")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Event {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "Le titre est obligatoire")
    @Size(min = 5, message = "Le titre doit contenir au moins 5 caractères")
    @Column(nullable = false)
    private String title;
    
    @NotBlank(message = "La description est obligatoire")
    @Size(min = 30, message = "La description doit contenir au moins 30 caractères")
    @Column(nullable = false, length = 1000)
    private String description;
    
    @NotNull(message = "La date est obligatoire")
    @Column(nullable = false)
    private LocalDate date;
    
    @NotBlank(message = "Le lieu est obligatoire")
    @Column(nullable = false)
    private String place;
    
    @NotNull(message = "Le prix est obligatoire")
    @Min(value = 0, message = "Le prix ne peut pas être négatif")
    @Column(nullable = false)
    private Double price;
    
    @NotNull(message = "L'ID de l'organisateur est obligatoire")
    @Column(nullable = false)
    private Long organizerId;
    
    @Column(nullable = false)
    private String imageUrl = "images/event.png";
    
    @NotNull(message = "Le nombre de places est obligatoire")
    @Min(value = 0, message = "Le nombre de places ne peut pas être négatif")
    @Column(nullable = false)
    private Integer nbPlaces;
    
    @Column(nullable = false)
    private Integer nbLikes = 0;
    
    @ElementCollection
    @CollectionTable(name = "event_domaines", joinColumns = @JoinColumn(name = "event_id"))
    @Column(name = "domaine")
    private List<String> domaines = new ArrayList<>();
}

