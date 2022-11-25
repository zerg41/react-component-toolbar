import styled from 'styled-components';
import { Select, DatePicker } from 'antd';
import 'moment/locale/ru';
import locale from 'antd/es/date-picker/locale/ru_RU';

const { RangePicker } = DatePicker;

export const StyledSelect = styled(Select).attrs({})`
  width: 120px;
  margin-left: 10px;

  & .ant-select-selector {
    box-sizing: border-box !important;
    height: 30px !important;
    border-radius: 6px !important;
  }
`;

export const YearSelect = styled(StyledSelect).attrs({
  placeholder: 'Год',
})`
  margin-left: 0;
`;

export const QuarterSelect = styled(StyledSelect).attrs({
  placeholder: 'Квартал',
})``;

export const MonthSelect = styled(StyledSelect).attrs({
  placeholder: 'Месяц',
})``;

export const StyledRangePicker = styled(RangePicker).attrs({
  locale: locale,
})`
  /* width: 250px; */
  border-radius: 6px;
`;
