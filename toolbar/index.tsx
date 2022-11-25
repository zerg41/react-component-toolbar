import React, { FC, useCallback, useEffect } from 'react';
// navigation
import { useLocation } from 'react-router-dom';
// store
import { useAppDispatch, useAppSelector } from 'hooks';
import { getIsContentEdited, getSelectedToolbarConfig } from 'store/toolbar';
import {
  setDate,
  resetSubsidiaries,
  resetFields,
  resetStations,
  resetCompressors,
  resetDate,
} from 'store/filter';
// components
import { ActionButton, Display } from 'components';
import { DataFilter, DateFilter } from './components';
// styled
import {
  ActionButtonsContainer,
  DataFilterContainer,
  DateFilterContainer,
  DisplayContainer,
  ToolbarContainer,
} from './styled';
// utils
import type { ActionButtonType, IDateRange, IToolbarConfig } from 'utils/types';

type ToolbarProps = {
  config?: IToolbarConfig;
};

export const Toolbar: FC<ToolbarProps> = () => {
  let dispatch = useAppDispatch();
  let location = useLocation();
  let config = useAppSelector(getSelectedToolbarConfig);
  let isEdit = useAppSelector(getIsContentEdited);

  // TODO:
  // Перенести логику сбрасывания фильтров из компонента DateFilter в Toolbar
  useEffect(() => {
    dispatch(resetSubsidiaries());
    dispatch(resetFields());
    dispatch(resetStations());
    dispatch(resetCompressors());
  }, [location.pathname]);

  useEffect(() => {
    if (!config.dateFilter) {
      dispatch(resetDate());
    }
  }, [config]);

  let handleDateChange = useCallback(({ dateStart, dateEnd }: IDateRange) => {
    dispatch(setDate({ dateStart, dateEnd }));
  }, []);

  function renderActionButtons(actions: ActionButtonType[]) {
    return actions.map((action, index) => (
      <ActionButton
        key={index}
        action={action}
        placement='toolbar'
        disabled={action === 'reset-filter' && isEdit ? true : false}
      />
    ));
  }

  return (
    <ToolbarContainer>
      <DateFilterContainer>
        {config.dateFilter && <DateFilter config={config.dateFilter} setDate={handleDateChange} />}
      </DateFilterContainer>

      {config.dataFilter && (
        <DataFilterContainer>
          <DataFilter config={config.dataFilter} />
        </DataFilterContainer>
      )}

      {config.display && (
        <DisplayContainer>
          <Display type={config.display.type} placement='toolbar' />
        </DisplayContainer>
      )}

      {config.actionButtons && config.actionButtons.length && (
        <ActionButtonsContainer>{renderActionButtons(config.actionButtons)}</ActionButtonsContainer>
      )}
    </ToolbarContainer>
  );
};
