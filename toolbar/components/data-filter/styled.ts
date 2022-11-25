import styled from 'styled-components';
import { Select } from 'antd';

export const { Option, OptGroup } = Select;

export const StyledSelect = styled(Select).attrs({})`
  width: 200px;
  margin-left: 10px;

  & .ant-select-selector {
    box-sizing: border-box !important;
    height: 30px !important;
    border-radius: 6px !important;
    display: flex;
    flex-direction: row;
    overflow: hidden;
  }
`;

export const SubsidiarySelect = styled(StyledSelect).attrs({
  placeholder: 'Актив',
})`
  margin-left: 0;
`;

export const FieldSelect = styled(StyledSelect).attrs({
  placeholder: 'Месторождение',
})``;

export const StationSelect = styled(StyledSelect).attrs({
  placeholder: 'Объект',
})``;

export const CompressorSelect = styled(StyledSelect).attrs({
  placeholder: 'Ед. Оборудования',
})``;
