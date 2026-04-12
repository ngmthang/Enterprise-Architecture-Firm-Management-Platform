package com.example.architectureplatform.service_catalog.service;

import com.example.architectureplatform.service_catalog.dto.request.CreateServiceOfferingRequest;
import com.example.architectureplatform.service_catalog.dto.request.UpdateServiceOfferingRequest;
import com.example.architectureplatform.service_catalog.dto.response.ServiceOfferingResponse;
import com.example.architectureplatform.service_catalog.entity.ServiceOffering;
import com.example.architectureplatform.service_catalog.exception.ServiceOfferingNotFoundByIdException;
import com.example.architectureplatform.service_catalog.exception.ServiceOfferingNotFoundException;
import com.example.architectureplatform.service_catalog.exception.ServiceOfferingSlugAlreadyExistsException;
import com.example.architectureplatform.service_catalog.mapper.ServiceOfferingMapper;
import com.example.architectureplatform.service_catalog.repository.ServiceOfferingRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ServiceOfferingService {

    private final ServiceOfferingRepository serviceOfferingRepository;
    private final ServiceOfferingMapper serviceOfferingMapper;

    public ServiceOfferingService(
            ServiceOfferingRepository serviceOfferingRepository,
            ServiceOfferingMapper serviceOfferingMapper
    ) {
        this.serviceOfferingRepository = serviceOfferingRepository;
        this.serviceOfferingMapper = serviceOfferingMapper;
    }

    @Transactional
    public ServiceOfferingResponse createServiceOffering(CreateServiceOfferingRequest request) {
        if (serviceOfferingRepository.existsBySlug(request.slug())) {
            throw new ServiceOfferingSlugAlreadyExistsException(request.slug());
        }

        ServiceOffering serviceOffering = serviceOfferingMapper.toEntity(request);
        ServiceOffering savedServiceOffering = serviceOfferingRepository.save(serviceOffering);
        return serviceOfferingMapper.toResponse(savedServiceOffering);
    }

    @Transactional
    public ServiceOfferingResponse updateServiceOffering(Long id, UpdateServiceOfferingRequest request) {
        ServiceOffering serviceOffering = serviceOfferingRepository.findById(id)
                .orElseThrow(() -> new ServiceOfferingNotFoundByIdException(id));

        if (serviceOfferingRepository.existsBySlugAndIdNot(request.slug(), id)) {
            throw new ServiceOfferingSlugAlreadyExistsException(request.slug());
        }

        serviceOffering.setName(request.name());
        serviceOffering.setSlug(request.slug());
        serviceOffering.setShortDescription(request.shortDescription());
        serviceOffering.setFullDescription(request.fullDescription());
        serviceOffering.setIcon(request.icon());
        serviceOffering.setFeatured(request.featured());
        serviceOffering.setDisplayOrder(request.displayOrder());
        serviceOffering.setActive(request.active());

        ServiceOffering updatedServiceOffering = serviceOfferingRepository.save(serviceOffering);
        return serviceOfferingMapper.toResponse(updatedServiceOffering);
    }

    @Transactional(readOnly = true)
    public List<ServiceOfferingResponse> getActiveServiceOfferings() {
        return serviceOfferingRepository.findByActiveTrueOrderByDisplayOrderAscCreatedAtDesc()
                .stream()
                .map(serviceOfferingMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public ServiceOfferingResponse getActiveServiceOfferingBySlug(String slug) {
        ServiceOffering serviceOffering = serviceOfferingRepository.findBySlug(slug)
                .filter(ServiceOffering::isActive)
                .orElseThrow(() -> new ServiceOfferingNotFoundException(slug));

        return serviceOfferingMapper.toResponse(serviceOffering);
    }
}