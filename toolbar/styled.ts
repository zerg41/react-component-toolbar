import styled from 'styled-components';
import { TOOLBAR_HEIGHT } from 'utils/constants';

export const ToolbarContainer = styled.section`
  display: flex;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  height: ${TOOLBAR_HEIGHT};
  padding: 0 20px;
  border-bottom: 1px solid rgba(0, 65, 102, 0.2);
  background-color: #ffffff;
`;

const ToolbarItemContainer = styled.div`
  display: flex;
  flex-grow: 1;
  justify-content: start;
  max-height: 30px;
  margin-left: 40px;
`;

export const DateFilterContainer = styled(ToolbarItemContainer)`
  flex-grow: 0;
  width: 280px;
  min-width: 280px;
  margin-left: 0;
`;

export const DataFilterContainer = styled(ToolbarItemContainer)`
  max-width: 1200px;
`;

export const DisplayContainer = styled(ToolbarItemContainer)`
  align-items: baseline;
  justify-content: end;
`;

export const ActionButtonsContainer = styled(ToolbarItemContainer)`
  align-items: center;
  justify-content: end;
  column-gap: 10px;
`;
