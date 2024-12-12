import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { getConfig } from '@edx/frontend-platform';

import { Button } from '@openedx/paragon';

import useCardDetailsData from './hooks';
import './index.scss';

export const CourseCardDetails = ({ cardId }) => {
  const data = useCardDetailsData({ cardId });
  const {
    providerName,
    accessMessage,
    isEntitlement,
    isFulfilled,
    canChange,
    openSessionModal,
    courseNumber,
    changeOrLeaveSessionMessage,
    courseId
  } = data;

  const [courseOverview, setCourseOverview] = useState('');

  useEffect(() => {
    if (courseId) {
      const fetchCourseDetails = async () => {
        try {
          const baseUrl = getConfig().LMS_BASE_URL;
          const url = `${baseUrl}/api/courses/v1/courses/${courseId}`;

          const response = await axios.get(url);
          setCourseOverview(response.data.short_description);
        } catch (error) {
        }
      };

      fetchCourseDetails();
    }
  }, [courseId]);

  return (
    <span className="small" data-testid="CourseCardDetails">
      <span className='course-description' dangerouslySetInnerHTML={{ __html: courseOverview }} />
      {isEntitlement && isFulfilled && canChange ? (
        <>
          {' • '}
          <Button variant="link" size="inline" className="m-0 p-0" onClick={openSessionModal}>
            {changeOrLeaveSessionMessage}
          </Button>
        </>
      ) : null}
    </span>
  );
};

CourseCardDetails.propTypes = {
  cardId: PropTypes.string.isRequired,
};

CourseCardDetails.defaultProps = {};

export default CourseCardDetails;
