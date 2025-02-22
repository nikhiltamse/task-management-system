package com.example.taskservice.service;

import com.example.taskservice.dto.TaskDTO;
import com.example.taskservice.entity.Task;
import com.example.taskservice.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;

    public TaskDTO createTask(TaskDTO taskDTO) {
        Task task = new Task(taskDTO.getTitle(), taskDTO.getDescription(), taskDTO.getStatus(), taskDTO.getUserId());
        Task savedTask = taskRepository.save(task);
        return new TaskDTO(savedTask.getId(), savedTask.getTitle(), savedTask.getDescription(), savedTask.getStatus(), savedTask.getUserId());
    }

    public List<TaskDTO> getTasksByUserId(Long userId) {
        List<Task> tasks = taskRepository.findByUserId(userId);
        if (tasks.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No tasks found for user ID: " + userId);
        }
        return tasks.stream()
                .map(task -> new TaskDTO(task.getId(), task.getTitle(), task.getDescription(), task.getStatus(), task.getUserId()))
                .collect(Collectors.toList());
    }

    public TaskDTO getTaskById(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Task not found with ID: " + id));
        return new TaskDTO(task.getId(), task.getTitle(), task.getDescription(), task.getStatus(), task.getUserId());
    }

    public TaskDTO updateTask(Long id, TaskDTO taskDTO) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Task not found with ID: " + id));
        task.setTitle(taskDTO.getTitle());
        task.setDescription(taskDTO.getDescription());
        task.setStatus(taskDTO.getStatus());
        Task updatedTask = taskRepository.save(task);
        return new TaskDTO(updatedTask.getId(), updatedTask.getTitle(), updatedTask.getDescription(), updatedTask.getStatus(), updatedTask.getUserId());
    }

    public void deleteTask(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Task not found with ID: " + id));
        taskRepository.delete(task);
    }
}