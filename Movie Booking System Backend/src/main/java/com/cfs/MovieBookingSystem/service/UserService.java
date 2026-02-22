package com.cfs.MovieBookingSystem.service;

import com.cfs.MovieBookingSystem.dto.UserDto;
import com.cfs.MovieBookingSystem.exception.ResourceNotFoundException;
import com.cfs.MovieBookingSystem.model.User;
import com.cfs.MovieBookingSystem.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    public UserDto createUser(UserDto userDto){
        User user= mapToEntity(userDto);
        User savedUser= userRepository.save(user);
        return mapToDto(savedUser);
    }

    public UserDto getUserById(Long id){
        User user= userRepository.findById(id)
                .orElseThrow(()->new ResourceNotFoundException("User Not Found with id :"+id));
        return mapToDto(user);
    }
    public List<UserDto> getAllUsers(){
        List<User> users =userRepository.findAll();
        return users.stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    // update user
    public UserDto updateUser(Long id, UserDto userDto){
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User Not Found with id :" + id));

        user.setName(userDto.getName());
        user.setEmail(userDto.getEmail());
        user.setPhoneNumber(userDto.getPhoneNumber());

        User updatedUser = userRepository.save(user);
        return mapToDto(updatedUser);
    }

    // delete user
    public void deleteUser(Long id){
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User Not Found with id :" + id));

        userRepository.delete(user);
    }

    private User mapToEntity(UserDto userDto){
        User user = new User();
        user.setEmail(userDto.getEmail());
        user.setName(userDto.getName());
        user.setPhoneNumber(userDto.getPhoneNumber());
        return user;
    }
    private UserDto mapToDto(User user){
        UserDto userDto = new UserDto();
        userDto.setId(user.getId());
        userDto.setName(user.getName());
        userDto.setEmail(user.getEmail());
        userDto.setPhoneNumber(user.getPhoneNumber());
       return userDto;

    }
}
