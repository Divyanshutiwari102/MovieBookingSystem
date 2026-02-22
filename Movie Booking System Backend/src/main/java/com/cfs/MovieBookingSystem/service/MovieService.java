package com.cfs.MovieBookingSystem.service;

import com.cfs.MovieBookingSystem.dto.MovieDto;
import com.cfs.MovieBookingSystem.exception.ResourceNotFoundException;
import com.cfs.MovieBookingSystem.model.Movie;
import com.cfs.MovieBookingSystem.repository.MovieRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MovieService {

    @Autowired
    private MovieRepository movieRepository;

    public MovieDto createMovie(MovieDto movieDto){
        Movie movie =mapToEntity(movieDto);
        Movie saveMovie = movieRepository.save(movie);
        return  mapToDto(saveMovie);
    }

    public MovieDto getMovieById(Long id){
        Movie movie =movieRepository.findById(id)
                .orElseThrow(()->new ResourceNotFoundException("Movie Not Found with id"+id));
        return mapToDto(movie);
    }
    public List<MovieDto> getAllMovie(){
        List<Movie> movies=movieRepository.findAll();
        return movies.stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }
    public List<MovieDto> getMovieByLanguage(String language){
        List<Movie> movies=movieRepository.findByLanguage(language);
        return movies.stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }
    public List<MovieDto> getMovieByGenre(String genre){
        List<Movie> movies=movieRepository.findByGenre(genre);
        return movies.stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }
    public List<MovieDto> SearchMovies(String title){
        List<Movie> movies=movieRepository.findByTitleContaining(title);
        return movies.stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public MovieDto updateMovie(Long id,MovieDto movieDto){
        Movie movie = movieRepository.findById(id)
                .orElseThrow(()->new ResourceNotFoundException("Movie not found with id:"+id));
        movie.setTitle(movieDto.getTitle());
        movie.setDescription(movieDto.getDescription());
        movie.setLanguage(movieDto.getLanguage());
        movie.setDurationMins(movieDto.getDurationMins());
        movie.setGenre(movieDto.getGenre());
        movie.setReleaseDate(movieDto.getReleaseDate());
        movie.setPosterUrl(movieDto.getPosterUrl());

        Movie updateMovie =movieRepository.save(movie);
        return mapToDto(updateMovie);

    }
    public void  deleteMovie(Long id){
        Movie movie =movieRepository.findById(id)
                .orElseThrow(()->new ResourceNotFoundException(" Movie not Found with id :"+id));
        movieRepository.delete(movie);
    }

public MovieDto mapToDto(Movie movie){
        MovieDto movieDto = new MovieDto();
        movieDto.setId(movie.getId());
    movieDto.setTitle(movie.getTitle());
    movieDto.setGenre(movie.getGenre());
    movieDto.setReleaseDate(movie.getReleaseDate());
    movieDto.setDescription(movie.getDescription());
    movieDto.setDurationMins(movie.getDurationMins());
    movieDto.setPosterUrl(movie.getPosterUrl());
    movieDto.setLanguage(movie.getLanguage());
    return movieDto;


}
    public Movie mapToEntity(MovieDto movieDto){
        Movie movie = new Movie();
        movie.setTitle(movieDto.getTitle());
        movie.setDescription(movieDto.getDescription());
        movie.setGenre(movieDto.getGenre());
        movie.setLanguage(movieDto.getLanguage());
        movie.setDurationMins(movieDto.getDurationMins());
        movie.setReleaseDate(movieDto.getReleaseDate());
        movie.setPosterUrl(movieDto.getPosterUrl());
        return movie;
    }
}
