package com.cfs.MovieBookingSystem.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class TmdbService {

    @Value("${tmdb.api.key}")
    private String apiKey;

    private static final String BASE = "https://api.themoviedb.org/3";

    private final RestTemplate restTemplate;

    public TmdbService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public List<Map<String, Object>> fetchNowPlaying() {
        return fetchResults(BASE + "/movie/now_playing?api_key=" + apiKey + "&language=en-US&page=1");
    }

    public List<Map<String, Object>> fetchPopular() {
        return fetchResults(BASE + "/movie/popular?api_key=" + apiKey + "&language=en-US&page=1");
    }

    public List<Map<String, Object>> fetchTopRated() {
        return fetchResults(BASE + "/movie/top_rated?api_key=" + apiKey + "&language=en-US&page=1");
    }

    public List<Map<String, Object>> fetchUpcoming() {
        return fetchResults(BASE + "/movie/upcoming?api_key=" + apiKey + "&language=en-US&page=1");
    }

    @SuppressWarnings("unchecked")
    private List<Map<String, Object>> fetchResults(String url) {
        try {
            ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    null,
                    new ParameterizedTypeReference<Map<String, Object>>() {}
            );
            Map<String, Object> body = response.getBody();
            if (body == null) return new ArrayList<>();
            Object results = body.get("results");
            if (results instanceof List) {
                return (List<Map<String, Object>>) results;
            }
        } catch (Exception e) {
            System.out.println("TMDB fetch failed: " + e.getMessage());
        }
        return new ArrayList<>();
    }
}