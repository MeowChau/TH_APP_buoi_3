import React from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { routes, StackParamList } from '../../navigation/routes';
import {
  useAssignmentDetail,
  useDetailTitle,
} from '../../hooks/useEntityDetails';
import useAssignmentActions from '../../hooks/useAssignmentActions';
import ScreenContainer from '../../components/common/ScreenContainer';
import QueryFeedback from '../../components/common/QueryFeedback';
import LastUpdatedText from '../../components/common/LastUpdatedText';
import AssignmentDetails from '../../components/assignment/AssignmentDetails';
/** @param navigation - Điều hướng bắt buộc. @param route - Tham số định danh của màn hình chi tiết, nếu có. */
export default function AssignmentDetailScreen({
  route,
  navigation,
}: NativeStackScreenProps<StackParamList, typeof routes.AssignmentDetail>) {
  const data = useAssignmentDetail(route.params.id);
  const actions = useAssignmentActions();
  useDetailTitle(navigation, data.assignment?.title ?? 'Chi tiết bài tập');
  return (
    <ScreenContainer detail scroll>
      <QueryFeedback
        loading={data.loading}
        error={data.error}
        onRetry={data.refresh}
      />
      <LastUpdatedText timestamp={data.lastUpdated} />
      {data.assignment && (
        <AssignmentDetails
          assignment={data.assignment}
          pending={data.pending}
          busy={actions.isBusy(data.assignment.id)}
          onToggleStatus={() => {
            actions.toggle(route.params.id);
          }}
        />
      )}
    </ScreenContainer>
  );
}
