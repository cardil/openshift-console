import * as React from 'react';
import * as _ from 'lodash';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Flex, FlexItem } from '@patternfly/react-core';
import {
  SidebarSectionHeading,
  ResourceLink,
  resourcePath,
} from '@console/internal/components/utils';
import { referenceForModel } from '@console/internal/module/k8s';
import { TopologyOverviewItem } from '@console/topology/src/topology-types';
import { PipelineRunModel, PipelineModel } from '../../../models';
import TriggerLastRunButton from './TriggerLastRunButton';
import PipelineRunItem from './PipelineRunItem';
import PipelineStartButton from './PipelineStartButton';

const MAX_VISIBLE = 3;

type PipelinesOverviewProps = {
  item: TopologyOverviewItem;
};

const PipelinesOverview: React.FC<PipelinesOverviewProps> = ({
  item: {
    pipelines: [pipeline],
    pipelineRuns,
  },
}) => {
  const { t } = useTranslation();
  const {
    metadata: { name, namespace },
  } = pipeline;
  return (
    <>
      <SidebarSectionHeading text={PipelineRunModel.labelPlural}>
        {pipelineRuns.length > MAX_VISIBLE && (
          <Link
            className="sidebar__section-view-all"
            to={`${resourcePath(referenceForModel(PipelineModel), name, namespace)}/Runs`}
          >
            {t('pipelines-plugin~View all {{pipelineRunsLength}}', {
              pipelineRunsLength: pipelineRuns.length,
            })}
          </Link>
        )}
      </SidebarSectionHeading>
      <ul className="list-group">
        <li className="list-group-item pipeline-overview">
          <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }}>
            <FlexItem>
              <ResourceLink
                inline
                kind={referenceForModel(PipelineModel)}
                name={name}
                namespace={namespace}
              />
            </FlexItem>
            <FlexItem>
              {pipelineRuns.length === 0 ? (
                <PipelineStartButton pipeline={pipeline} namespace={namespace} />
              ) : (
                <TriggerLastRunButton pipelineRuns={pipelineRuns} namespace={namespace} />
              )}
            </FlexItem>
          </Flex>
        </li>
        {_.take(pipelineRuns, MAX_VISIBLE).map((pr) => (
          <PipelineRunItem key={pr.metadata.uid} pipelineRun={pr} />
        ))}
      </ul>
    </>
  );
};

export default PipelinesOverview;
