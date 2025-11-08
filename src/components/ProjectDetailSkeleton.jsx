import React from 'react';

const ProjectDetailSkeleton = () => {
  return (
    <div className="project-detail__container animate-pulse">
      {/* Back button skeleton */}
      <div className="project-detail__back h-8 w-24 bg-gray-300 rounded-md mb-8"></div>

      {/* Hero skeleton */}
      <div className="project-detail__hero">
        <div className="project-detail__hero-content">
          <div className="h-12 w-3/4 bg-gray-300 rounded-md mb-4"></div>
          <div className="h-6 w-full bg-gray-300 rounded-md mb-2"></div>
          <div className="h-6 w-5/6 bg-gray-300 rounded-md mb-2"></div>
          <div className="h-6 w-4/6 bg-gray-300 rounded-md"></div>
        </div>

        {/* Gallery skeleton */}
        <div className="project-detail__gallery">
          <div className="project-detail__gallery-item project-detail__gallery-item--1 h-96 bg-gray-300 rounded-lg"></div>
          <div className="project-detail__gallery-item project-detail__gallery-item--2 h-64 bg-gray-300 rounded-lg"></div>
          <div className="project-detail__gallery-item project-detail__gallery-item--3 h-64 bg-gray-300 rounded-lg"></div>
        </div>

        {/* Meta skeleton */}
        <div className="project-detail__meta mt-8 flex space-x-8">
          <div className="flex flex-col space-y-2">
            <div className="h-4 w-20 bg-gray-300 rounded-md"></div>
            <div className="h-6 w-32 bg-gray-300 rounded-md"></div>
          </div>
          <div className="flex flex-col space-y-2">
            <div className="h-4 w-16 bg-gray-300 rounded-md"></div>
            <div className="h-6 w-24 bg-gray-300 rounded-md"></div>
          </div>
          <div className="h-10 w-32 bg-gray-300 rounded-md"></div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailSkeleton;
