import React from 'react';
import './ProjectDetailSkeleton.css';

const ProjectDetailSkeleton = () => {
  return (
    <div className="project-detail-skeleton">
      <div className="skeleton skeleton-text skeleton-title"></div>
      <div className="skeleton skeleton-text skeleton-description"></div>
      <div className="skeleton skeleton-text skeleton-description"></div>
      <div className="skeleton skeleton-image"></div>
      <div className="project-detail-skeleton-meta">
        <div className="skeleton skeleton-text skeleton-meta-item"></div>
        <div className="skeleton skeleton-text skeleton-meta-item"></div>
      </div>
    </div>
  );
};

export default ProjectDetailSkeleton;