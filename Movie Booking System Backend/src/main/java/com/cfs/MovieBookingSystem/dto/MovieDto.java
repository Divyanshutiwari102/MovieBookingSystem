package com.cfs.MovieBookingSystem.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MovieDto {

    private Long id;
    private String title;
    @Column(columnDefinition = "TEXT")
    private String description;
    private String language;
    private String  genre;
    private Integer durationMins;
    private String releaseDate;
    private String posterUrl;
}
