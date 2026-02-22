package com.cfs.MovieBookingSystem;

import com.cfs.MovieBookingSystem.model.Movie;
import com.cfs.MovieBookingSystem.repository.MovieRepository;
import com.cfs.MovieBookingSystem.service.TmdbService;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Component
@RequiredArgsConstructor
public class DataLoader implements CommandLineRunner {

    private final MovieRepository movieRepository;
    private final TmdbService     tmdbService;

    @Override
    public void run(String... args) {

        if (movieRepository.count() > 0) {
            System.out.println("Movies already in DB: " + movieRepository.count() + ". Skipping.");
            return;
        }

        System.out.println("Importing movies from TMDB...");

        List<Movie> toSave    = new ArrayList<>();
        Set<String> seenTitles = new HashSet<>();

        // Fetch from all 4 categories
        List<Map<String, Object>> allResults = new ArrayList<>();
        allResults.addAll(tmdbService.fetchNowPlaying());
        allResults.addAll(tmdbService.fetchPopular());
        allResults.addAll(tmdbService.fetchTopRated());
        allResults.addAll(tmdbService.fetchUpcoming());

        for (Map<String, Object> m : allResults) {
            if (toSave.size() >= 50) break;

            String title = getString(m, "title");
            if (title == null || title.isBlank())    continue;
            if (seenTitles.contains(title))           continue;
            seenTitles.add(title);

            String posterPath = getString(m, "poster_path");
            if (posterPath == null)                   continue;
            String posterUrl = "https://image.tmdb.org/t/p/w500" + posterPath;

            Movie movie = new Movie();
            movie.setTitle(title);
            movie.setDescription(getStringOrDefault(m, "overview", "No description available."));
            movie.setLanguage(mapLanguage(getString(m, "original_language")));
            movie.setGenre(mapGenre(m.get("genre_ids")));
            movie.setDurationMins(120);
            movie.setReleaseDate(getStringOrDefault(m, "release_date", "2024-01-01"));
            movie.setPosterUrl(posterUrl);

            toSave.add(movie);
        }

        if (!toSave.isEmpty()) {
            movieRepository.saveAll(toSave);
            System.out.println("Imported " + toSave.size() + " movies from TMDB!");
        } else {
            System.out.println("No movies imported. Check TMDB_API_KEY.");
        }
    }

    // ── Helpers ──────────────────────────────────────────────────────

    private String getString(Map<String, Object> map, String key) {
        Object val = map.get(key);
        if (val == null) return null;
        String s = val.toString();
        return s.equals("null") ? null : s;
    }

    private String getStringOrDefault(Map<String, Object> map, String key, String def) {
        String val = getString(map, key);
        return (val == null || val.isBlank()) ? def : val;
    }

    private String mapLanguage(String lang) {
        if (lang == null) return "English";
        switch (lang) {
            case "hi": return "Hindi";
            case "ta": return "Tamil";
            case "te": return "Telugu";
            case "ml": return "Malayalam";
            case "kn": return "Kannada";
            case "ko": return "Korean";
            case "ja": return "Japanese";
            default:   return "English";
        }
    }

    @SuppressWarnings("unchecked")
    private String mapGenre(Object genreIdsObj) {
        if (!(genreIdsObj instanceof List)) return "Drama";
        List<Object> ids = (List<Object>) genreIdsObj;
        if (ids.isEmpty()) return "Drama";
        int id = ((Number) ids.get(0)).intValue();
        switch (id) {
            case 28:    return "Action";
            case 35:    return "Comedy";
            case 27:    return "Horror";
            case 878:   return "Sci-Fi";
            case 53:    return "Thriller";
            case 16:    return "Animation";
            case 18:    return "Drama";
            case 10749: return "Romance";
            case 12:    return "Adventure";
            case 80:    return "Crime";
            default:    return "Drama";
        }
    }
}