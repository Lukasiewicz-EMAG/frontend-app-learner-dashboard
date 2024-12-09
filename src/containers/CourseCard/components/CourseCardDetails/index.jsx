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
  console.log('data', data)

  const [courseOverview, setCourseOverview] = useState('');

  useEffect(() => {
    console.log('CourseCardDetails useEffect courseId', courseId)
    if (courseId) {
      const fetchCourseDetails = async () => {
        try {
          const baseUrl = getConfig().LMS_BASE_URL;
          console.log('baseUrl', baseUrl)
          const url = `${baseUrl}/api/courses/v1/courses/${courseId}`;
          console.log('url', url)
          
          const response = await axios.get(url);
          console.log('Course details:', response.data);
          setCourseOverview(response.data.short_description);
        } catch (error) {
          console.error('Error fetching course details:', error);
        }
      };

      fetchCourseDetails();
    }
  }, [courseId]);

  return (
    <span className="small" data-testid="CourseCardDetails">
      <span dangerouslySetInnerHTML={{ __html: courseOverview }} />
      {!(isEntitlement && !isFulfilled) && accessMessage && (
        ` • ${accessMessage}`
      )}
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
