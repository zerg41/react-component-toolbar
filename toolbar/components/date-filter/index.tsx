import React, { FC, useEffect, useMemo, useState } from 'react';
// navigation
import { useLocation } from 'react-router-dom';
// styled
import { MonthSelect, QuarterSelect, StyledRangePicker, YearSelect } from './styled';
// utils
import moment, { Moment } from 'moment';
import type { IDateFilterConfig, DateValue, IDateRange } from 'utils/types';

const baseMonths: DateValue[] = [
  { value: 0, label: 'Январь' },
  { value: 1, label: 'Февраль' },
  { value: 2, label: 'Март' },
  { value: 3, label: 'Апрель' },
  { value: 4, label: 'Май' },
  { value: 5, label: 'Июнь' },
  { value: 6, label: 'Июль' },
  { value: 7, label: 'Август' },
  { value: 8, label: 'Сентябрь' },
  { value: 9, label: 'Октябрь' },
  { value: 10, label: 'Ноябрь' },
  { value: 11, label: 'Декабрь' },
];
const baseQuarters: DateValue[] = [
  { value: 0, label: '30/90' },
  { value: 1, label: 'I КВ' },
  { value: 2, label: 'II КВ' },
  { value: 3, label: 'III КВ' },
  { value: 4, label: 'IV КВ' },
];

let currentDate = moment();
let currentYear = currentDate.year();
let currentQuarter = currentDate.quarter();
let currentQuarterName = baseQuarters.filter((q) => q.value === currentQuarter)[0].label;
let forecastQuarter = baseQuarters[0].value;
let forecastQuarterName = baseQuarters[0].label;
let currentMonth = currentDate.month();
let currentMonthName = baseMonths.filter((m) => m.value === currentMonth)[0].label;

let defaultYearValue: DateValue = { value: currentYear, label: String(currentYear) };
let defaultQuarterValue: DateValue = { value: currentQuarter, label: currentQuarterName };
let forecastQuarterValue: DateValue = { value: forecastQuarter, label: forecastQuarterName };
let defaultMonthValue: DateValue = { value: currentMonth, label: currentMonthName };
let defaultRangeValue: [Moment, Moment] = [currentDate, currentDate];

type DateFilterProps = {
  config: IDateFilterConfig;
  setDate: ({ dateStart, dateEnd }: IDateRange) => void;
};

export const DateFilter: FC<DateFilterProps> = ({ config, setDate }) => {
  const { type } = config;

  let location = useLocation();

  let [selectedYear, setSelectedYear] = useState<DateValue>(defaultYearValue);
  let [selectedQuarter, setSelectedQuarter] = useState<DateValue>(defaultQuarterValue);
  let [selectedMonth, setSelectedMonth] = useState<DateValue>(defaultMonthValue);
  let [selectedDateRange, setSelectedDateRange] = useState<[Moment, Moment]>(defaultRangeValue);

  let yearOptions = useMemo(() => {
    let years: DateValue[] = [];

    switch (type.selector?.year) {
      case 'retrospective':
        const YEARS_BEFORE = 4;
        for (let diff = YEARS_BEFORE; diff > 0; diff--) {
          years.push({ value: currentYear - diff, label: String(currentYear - diff) });
        }
        years.push({ value: currentYear, label: String(currentYear) });
        break;

      case 'forecast':
        years.push({ value: currentYear - 1, label: String(currentYear - 1) });
        years.push({ value: currentYear, label: String(currentYear) });
        years.push({ value: currentYear + 1, label: String(currentYear + 1) });
        break;

      case 'current-read-only':
        years.push({ value: currentYear, label: String(currentYear) });
    }

    return years;
  }, [type]);

  let quarterOptions = useMemo(() => {
    let quarters = baseQuarters.reduce((memo, quarterOption) => {
      if (quarterOption.value > currentQuarter && selectedYear.value === currentYear) {
        return [...memo, { ...quarterOption, disabled: true }];
      }
      if (type.selector?.quarter === 'base' && quarterOption.value === 0) {
        return [...memo];
      }
      return [...memo, quarterOption];
    }, [] as DateValue[]);

    return quarters;
  }, [selectedYear, type]);

  let monthOptions = useMemo(() => {
    let months = baseMonths.map((monthOption) => {
      if (monthOption.value > currentMonth && selectedYear.value === currentYear) {
        return { ...monthOption, disabled: true };
      }
      return monthOption;
    });

    return months;
  }, [selectedYear]);

  let disableDaysAfterToday = (current: Moment) => {
    return current > moment().endOf('day');
  };

  /** Resets to Default Values on Mount */
  useEffect(() => {
    setSelectedYear(defaultYearValue);
    setSelectedQuarter(
      type.selector?.quarter === 'forecast' ? forecastQuarterValue : defaultQuarterValue
    );
    setSelectedMonth(defaultMonthValue);
    setSelectedDateRange(defaultRangeValue);
  }, [location.pathname, type]);

  /** Sets Selected Date in Store */
  useEffect(() => {
    let selectedDate: Moment;
    let selectedDateStart: string;
    let selectedDateEnd: string;
    let timeUnit: 'year' | 'quarter' | 'month' | 'day';

    if (type.selector) {
      if (type.selector.quarter && selectedQuarter.value !== 0) {
        timeUnit = 'quarter';
        selectedDate = moment().year(selectedYear.value).quarter(selectedQuarter.value);
        selectedDateStart = selectedDate.startOf(timeUnit).toJSON();
        selectedDateEnd = moment(selectedDate).endOf(timeUnit).toJSON();
      } else if (type.selector.quarter && selectedQuarter.value === 0) {
        timeUnit = 'month';
        selectedDate = moment().year(selectedYear.value).month(currentMonth);
        selectedDateStart = selectedDate.startOf(timeUnit).toJSON();
        selectedDateEnd = moment(selectedDateStart).add(2, 'months').endOf(timeUnit).toJSON();
      } else if (type.selector.month) {
        timeUnit = 'month';
        selectedDate = moment().year(selectedYear.value).month(selectedMonth.value);
        selectedDateStart = selectedDate.startOf(timeUnit).toJSON();
        selectedDateEnd = selectedDate.endOf(timeUnit).toJSON();
      } else {
        timeUnit = 'year';
        selectedDate = moment().year(selectedYear.value);
        selectedDateStart = selectedDate.startOf(timeUnit).toJSON();
        selectedDateEnd = selectedDate.endOf(timeUnit).toJSON();
      }
    } else {
      let [selectedDateRangeStart, selectedDateRangeEnd] = selectedDateRange;
      timeUnit = 'day';
      selectedDateStart = selectedDateRangeStart.startOf(timeUnit).toJSON();
      selectedDateEnd = selectedDateRangeEnd.endOf(timeUnit).toJSON();
    }

    setDate({ dateStart: selectedDateStart, dateEnd: selectedDateEnd });
  }, [selectedYear, selectedQuarter, selectedMonth, selectedDateRange, type]);

  function onYearChange(value: unknown, option: unknown) {
    let selectedOption = option as DateValue;

    if (selectedOption.value === currentYear && currentMonth < selectedMonth.value) {
      setSelectedMonth(defaultMonthValue);
    }

    if (selectedOption.value === currentYear && currentQuarter < selectedQuarter.value) {
      setSelectedQuarter(defaultQuarterValue);
    }

    setSelectedYear(selectedOption);
  }

  function onQuarterChange(value: unknown, option: unknown) {
    let selectedOption = option as DateValue;

    setSelectedQuarter(selectedOption);
  }

  function onMonthChange(value: unknown, option: unknown) {
    let selectedOption = option as DateValue;

    setSelectedMonth(selectedOption);
  }

  function onDateRangeChange(
    dates: [Moment | null, Moment | null] | null,
    dateStrings: [string, string] | null
  ) {
    if (dates && dates[0] && dates[1]) {
      let [selectedDateStart, selectedDateEnd] = dates;
      setSelectedDateRange([selectedDateStart, selectedDateEnd]);
    } else {
      setSelectedDateRange(defaultRangeValue);
    }
  }

  if (type.selector) {
    return (
      <>
        {type.selector.year && (
          <YearSelect
            options={yearOptions}
            value={selectedYear}
            disabled={type.selector.year === 'current-read-only' && true}
            onChange={onYearChange}
          />
        )}
        {type.selector.quarter &&
          !(location.pathname === '/planning/business-plan-update/quarter-forecast') && (
            <QuarterSelect
              options={quarterOptions}
              value={selectedQuarter}
              onChange={onQuarterChange}
            />
          )}
        {type.selector.month && (
          <MonthSelect options={monthOptions} value={selectedMonth} onChange={onMonthChange} />
        )}
      </>
    );
  } else if (type.datePicker) {
    return (
      <StyledRangePicker
        value={selectedDateRange}
        disabledDate={disableDaysAfterToday}
        onChange={onDateRangeChange}
        allowClear={true}
      />
    );
  } else {
    return <></>;
  }
};
