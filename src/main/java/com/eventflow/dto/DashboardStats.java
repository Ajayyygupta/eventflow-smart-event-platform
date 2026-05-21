package com.eventflow.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class DashboardStats {

    private Long totalUsers;
    private Long totalEvents;
    private Long totalBookings;

}
