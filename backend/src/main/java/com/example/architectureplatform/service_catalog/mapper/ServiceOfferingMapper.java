package com.example.architectureplatform.service_catalog.mapper;

import com.example.architectureplatform.service_catalog.dto.request.CreateServiceOfferingRequest;
import com.example.architectureplatform.service_catalog.dto.response.ServiceOfferingResponse;
import com.example.architectureplatform.service_catalog.entity.ServiceOffering;
import org.springframework.stereotype.Component;

@Component
public class ServiceOfferingMapper {

    public ServiceOffering toEntity(CreateServiceOfferingRequest request) {
        ServiceOffering serviceOffering = new ServiceOffering();
        serviceOffering.setName(request.name());
        serviceOffering.setSlug(request.slug());
        serviceOffering.setShortDescription(request.shortDescription());
        serviceOffering.setFullDescription(request.fullDescription());
        serviceOffering.setIcon(request.icon());
        serviceOffering.setFeatured(request.featured());
        serviceOffering.setDisplayOrder(request.displayOrder());
        serviceOffering.setActive(request.active());
        return serviceOffering;
    }

    public ServiceOfferingResponse toResponse(ServiceOffering serviceOffering) {
        return new ServiceOfferingResponse(
                serviceOffering.getId(),
                serviceOffering.getName(),
                serviceOffering.getSlug(),
                serviceOffering.getShortDescription(),
                serviceOffering.getFullDescription(),
                serviceOffering.getIcon(),
                serviceOffering.isFeatured(),
                serviceOffering.getDisplayOrder(),
                serviceOffering.isActive(),
                serviceOffering.getCreatedAt(),
                serviceOffering.getUpdatedAt()
        );
    }
}