import React, { FC, useContext, useEffect, useMemo, useState } from 'react';
// store
import { useAppDispatch, useAppSelector } from 'hooks';
import {
  getSelectedData,
  resetCompressors,
  resetFields,
  resetStations,
  setCompressors,
  setFields,
  setStations,
  setSubsidiaries,
} from 'store/filter';
import { getIsShowDataFilters } from 'store/toolbar';
// context
import { OptionsContext } from 'context';
// styled
import {
  CompressorSelect,
  FieldSelect,
  StationSelect,
  SubsidiarySelect,
  OptGroup,
  Option,
} from './styled';
// utils
import { GPN_UID, EMPTY_DATA } from 'utils/constants';
import { setTagLength, sortAlphabetically } from 'utils/functions';
import type {
  IDataFilterConfig,
  SelectorValue,
  SelectorType,
  FilterSelectionMode,
  DataItem,
} from 'utils/types';

type DataFilterProps = {
  config: IDataFilterConfig;
};

export const DataFilter: FC<DataFilterProps> = ({ config }) => {
  const { filtersSelectionMode } = config;
  let options = useContext(OptionsContext);
  let dispatch = useAppDispatch();

  let isShowDataFilters = useAppSelector(getIsShowDataFilters);
  let selectedData = useAppSelector(getSelectedData);
  let selectedSubsidiaries = selectedData.subsidiaries;
  let selectedFields = selectedData.fields;
  let selectedStations = selectedData.stations;
  let selectedCompressors = selectedData.compressors;

  let [selectedSubsidiariesOption, setSelectedSubsidiariesOption] = useState<SelectorValue[]>([]);
  let [selectedFieldsOption, setSelectedFieldsOption] = useState<SelectorValue[]>([]);
  let [selectedStationsOption, setSelectedStationsOption] = useState<SelectorValue[]>([]);
  let [selectedCompressorsOption, setSelectedCompressorsOption] = useState<SelectorValue[]>([]);

  // TODO: Унифицировать функцию для рендера опций в селекторах

  /** Sets Options to Selectors from Received Data **/
  let subsidiaryOptions = useMemo(() => {
    let optionsData = options?.subsidiary;

    return (
      optionsData &&
      optionsData[GPN_UID] &&
      optionsData[GPN_UID].slice()
        .sort((a, b) => sortAlphabetically(a.name, b.name))
        .map((selectedOption) => {
          return (
            <Option key={selectedOption.uid} value={selectedOption.uid}>
              {selectedOption.name}
            </Option>
          );
        })
    );
  }, [options]);

  let fieldOptions = useMemo(() => {
    let parentSelectorValues = selectedSubsidiariesOption.sort((a, b) =>
      sortAlphabetically(a.children, b.children)
    );
    let optionsData = options?.field;

    return parentSelectorValues.map((parentSelectorValue, index) => {
      return (
        optionsData &&
        optionsData[parentSelectorValue.value] && (
          <OptGroup key={index} label={parentSelectorValue.children}>
            {optionsData[parentSelectorValue.value]
              .slice()
              .sort((a, b) => sortAlphabetically(a.name, b.name))
              .map((selectedOption) => {
                return (
                  <Option key={selectedOption.uid} value={selectedOption.uid}>
                    {selectedOption.name}
                  </Option>
                );
              })}
          </OptGroup>
        )
      );
    });
  }, [selectedSubsidiariesOption, options]);

  let stationOptions = useMemo(() => {
    let parentSelectorValues = selectedFieldsOption.sort((a, b) =>
      sortAlphabetically(a.children, b.children)
    );
    let optionsData = options?.station;

    return parentSelectorValues.map((parentSelectorValue, index) => {
      return (
        optionsData &&
        optionsData[parentSelectorValue.value] && (
          <OptGroup key={index} label={parentSelectorValue.children}>
            {optionsData[parentSelectorValue.value]
              .slice()
              .sort((a, b) => sortAlphabetically(a.name, b.name))
              .map((selectedOption) => {
                return (
                  <Option key={selectedOption.uid} value={selectedOption.uid}>
                    {selectedOption.name}
                  </Option>
                );
              })}
          </OptGroup>
        )
      );
    });
  }, [selectedFieldsOption, options]);

  let compressorOptions = useMemo(() => {
    let parentSelectorValues = selectedStationsOption.sort((a, b) =>
      sortAlphabetically(a.children, b.children)
    );
    let optionsData = options?.compressor;

    return parentSelectorValues.map((parentSelectorValue, index) => {
      return (
        optionsData &&
        optionsData[parentSelectorValue.value] && (
          <OptGroup key={index} label={parentSelectorValue.children}>
            {optionsData[parentSelectorValue.value]
              .slice()
              .sort((a, b) => sortAlphabetically(a.name, b.name))
              .map((selectedOption) => {
                return (
                  <Option key={selectedOption.uid} value={selectedOption.uid}>
                    {selectedOption.name}
                  </Option>
                );
              })}
          </OptGroup>
        )
      );
    });
  }, [selectedStationsOption, options]);

  /* Effects */
  /** Set Selected Option When Data From Store Changes **/
  useEffect(() => {
    if (selectedSubsidiaries) {
      let selectedOptions: SelectorValue[] = [];

      selectedSubsidiaries.forEach((selectedSubsidiary) => {
        let selectedOption = options?.subsidiary[GPN_UID].find(
          (subsidiary) => subsidiary.uid === selectedSubsidiary.uid
        );

        if (selectedOption?.name && selectedOption?.uid) {
          selectedOptions.push({
            key: selectedOption.uid,
            children: selectedOption.name,
            value: selectedOption.uid,
          });
        }
      });

      if (selectedOptions.length) {
        setSelectedSubsidiariesOption(selectedOptions);
      } else {
        setSelectedSubsidiariesOption([]);
      }
    }

    if (selectedFields) {
      let selectedOptions: SelectorValue[] = [];

      selectedFields.forEach((selectedField) => {
        let selectedOption = selectedSubsidiariesOption.map((selectedSubsidiary) =>
          options?.field[selectedSubsidiary.value].find((field) => field.uid === selectedField.uid)
        );

        selectedOption.forEach((option) => {
          if (option?.name && option?.uid) {
            selectedOptions.push({
              key: option.uid,
              children: option.name,
              value: option.uid,
            });
          }
        });
      });

      if (selectedOptions.length) {
        setSelectedFieldsOption(selectedOptions);
      } else {
        setSelectedFieldsOption([]);
      }
    }

    if (selectedStations) {
      let selectedOptions: SelectorValue[] = [];

      selectedStations.forEach((selectedStation) => {
        let selectedOption = selectedFieldsOption.map((fieldOption) =>
          options?.station[fieldOption.value].find((station) => station.uid === selectedStation.uid)
        );

        selectedOption.forEach((option) => {
          if (option?.name && option?.uid) {
            selectedOptions.push({
              key: option.uid,
              children: option.name,
              value: option.uid,
            });
          }
        });
      });

      if (selectedOptions.length) {
        setSelectedStationsOption(selectedOptions);
      } else {
        setSelectedStationsOption([]);
      }
    }

    if (selectedCompressors) {
      let selectedOptions: SelectorValue[] = [];

      selectedCompressors.forEach((selectedCompressor) => {
        let selectedOption = selectedStationsOption.map((stationOption) =>
          options?.compressor[stationOption.value].find(
            (compressor) => compressor.uid === selectedCompressor.uid
          )
        );

        selectedOption.forEach((option) => {
          if (option?.name && option?.uid) {
            selectedOptions.push({
              key: option.uid,
              children: option.name,
              value: option.uid,
            });
          }
        });
      });

      if (selectedOptions.length) {
        setSelectedCompressorsOption(selectedOptions);
      } else {
        setSelectedCompressorsOption([]);
      }
    }
  }, [selectedData, options]);

  /* Handlers */
  function onSelect(
    selectorType: SelectorType,
    selectionMode: FilterSelectionMode,
    value: unknown,
    option: unknown
  ) {
    let selectedOption = option as SelectorValue;

    switch (selectionMode) {
      case 'multiple':
        switch (selectorType) {
          case 'subsidiary':
            setSelectedSubsidiariesOption([...selectedSubsidiariesOption, selectedOption]);
            break;
          case 'field':
            setSelectedFieldsOption([...selectedFieldsOption, selectedOption]);
            break;
          case 'station':
            setSelectedStationsOption([...selectedStationsOption, selectedOption]);
            break;
          case 'compressor':
            setSelectedCompressorsOption([...selectedCompressorsOption, selectedOption]);
            break;
        }
        break;

      case 'single':
        switch (selectorType) {
          case 'subsidiary':
            updateSubsidiariesStore([{ uid: selectedOption.value, name: selectedOption.children }]);
            break;
          case 'field':
            updateFieldsStore([{ uid: selectedOption.value, name: selectedOption.children }]);
            break;
          case 'station':
            updateStationsStore([{ uid: selectedOption.value, name: selectedOption.children }]);
            break;
          case 'compressor':
            updateCompressorsStore([{ uid: selectedOption.value, name: selectedOption.children }]);
            break;
        }
        break;
    }
  }

  function onDeselect(
    selectorType: SelectorType,
    selectionMode: FilterSelectionMode,
    value: unknown,
    option: unknown
  ) {
    let deselectedOption = option as SelectorValue;
    let setSelectedValues: React.Dispatch<React.SetStateAction<SelectorValue[]>>;

    switch (selectorType) {
      case 'subsidiary':
        setSelectedValues = setSelectedSubsidiariesOption;
        break;
      case 'field':
        setSelectedValues = setSelectedFieldsOption;
        break;
      case 'station':
        setSelectedValues = setSelectedStationsOption;
        break;
      case 'compressor':
        setSelectedValues = setSelectedCompressorsOption;
        break;
    }

    setSelectedValues((options) =>
      options.filter((option) => option.value !== deselectedOption.value)
    );
  }

  function onBlur(selectorType: SelectorType, selectionMode: FilterSelectionMode) {
    if (selectionMode === 'multiple') {
      switch (selectorType) {
        case 'subsidiary':
          let subsidiaries: DataItem[] = getDataItemsFromSelector(selectedSubsidiariesOption);
          updateSubsidiariesStore(subsidiaries);
          break;

        case 'field':
          let fields: DataItem[] = getDataItemsFromSelector(selectedFieldsOption);
          updateFieldsStore(fields);
          break;

        case 'station':
          let stations: DataItem[] = getDataItemsFromSelector(selectedStationsOption);
          updateStationsStore(stations);
          break;

        case 'compressor':
          let compressors: DataItem[] = getDataItemsFromSelector(selectedCompressorsOption);
          updateCompressorsStore(compressors);
          break;
      }
    }
  }

  /* Utils */
  function getDataItemsFromSelector(options: SelectorValue[]) {
    return options.map((option) => ({ uid: option.value, name: option.children }));
  }

  function updateSubsidiariesStore(subsidiaries: DataItem[]) {
    if (selectedFieldsOption.length) {
      dispatch(resetFields());
    }

    if (selectedStationsOption.length) {
      dispatch(resetStations());
    }

    if (selectedCompressorsOption.length) {
      dispatch(resetCompressors());
    }

    dispatch(setSubsidiaries(subsidiaries));
  }

  function updateFieldsStore(fields: DataItem[]) {
    if (selectedStationsOption.length) {
      dispatch(resetStations());
    }

    if (selectedCompressorsOption.length) {
      dispatch(resetCompressors());
    }

    dispatch(setFields(fields));
  }

  function updateStationsStore(stations: DataItem[]) {
    if (selectedCompressorsOption.length) {
      dispatch(resetCompressors());
    }

    dispatch(setStations(stations));
  }

  function updateCompressorsStore(compressors: DataItem[]) {
    dispatch(setCompressors(compressors));
  }

  return isShowDataFilters ? (
    <>
      {filtersSelectionMode.subsidiary && (
        <SubsidiarySelect
          mode={filtersSelectionMode.subsidiary === 'multiple' ? 'multiple' : undefined}
          value={selectedSubsidiariesOption}
          maxTagTextLength={setTagLength(selectedSubsidiariesOption.length)}
          showArrow
          showSearch={false}
          removeIcon={null}
          notFoundContent={EMPTY_DATA}
          disabled={false}
          onSelect={(value: unknown, option: unknown) =>
            onSelect('subsidiary', filtersSelectionMode.subsidiary, value, option)
          }
          onDeselect={(value: unknown, option: unknown) =>
            onDeselect('subsidiary', filtersSelectionMode.subsidiary, value, option)
          }
          onBlur={() => onBlur('subsidiary', filtersSelectionMode.subsidiary)}
        >
          {subsidiaryOptions}
        </SubsidiarySelect>
      )}
      {filtersSelectionMode.field && (
        <FieldSelect
          mode={filtersSelectionMode.field === 'multiple' ? 'multiple' : undefined}
          value={selectedFieldsOption}
          maxTagTextLength={setTagLength(selectedFieldsOption.length)}
          showArrow
          showSearch={false}
          removeIcon={null}
          notFoundContent={EMPTY_DATA}
          disabled={selectedSubsidiaries.length ? false : true}
          onSelect={(value: unknown, option: unknown) =>
            onSelect('field', filtersSelectionMode.field, value, option)
          }
          onDeselect={(value: unknown, option: unknown) =>
            onDeselect('field', filtersSelectionMode.field, value, option)
          }
          onBlur={() => onBlur('field', filtersSelectionMode.field)}
        >
          {fieldOptions}
        </FieldSelect>
      )}
      {filtersSelectionMode.station && (
        <StationSelect
          mode={filtersSelectionMode.station === 'multiple' ? 'multiple' : undefined}
          value={selectedStationsOption}
          maxTagTextLength={setTagLength(selectedStationsOption.length)}
          showArrow
          showSearch={false}
          removeIcon={null}
          notFoundContent={EMPTY_DATA}
          disabled={selectedFields?.length ? false : true}
          onSelect={(value: unknown, option: unknown) =>
            onSelect('station', filtersSelectionMode.station, value, option)
          }
          onDeselect={(value: unknown, option: unknown) =>
            onDeselect('station', filtersSelectionMode.station, value, option)
          }
          onBlur={() => onBlur('station', filtersSelectionMode.station)}
        >
          {stationOptions}
        </StationSelect>
      )}
      {filtersSelectionMode.compressor && (
        <CompressorSelect
          mode={filtersSelectionMode.compressor === 'multiple' ? 'multiple' : undefined}
          value={selectedCompressorsOption}
          maxTagTextLength={setTagLength(selectedCompressorsOption.length)}
          showArrow
          showSearch={false}
          removeIcon={null}
          notFoundContent={EMPTY_DATA}
          disabled={selectedStations?.length ? false : true}
          onSelect={(value: unknown, option: unknown) =>
            onSelect('compressor', filtersSelectionMode.compressor, value, option)
          }
          onDeselect={(value: unknown, option: unknown) =>
            onDeselect('compressor', filtersSelectionMode.compressor, value, option)
          }
          onBlur={() => onBlur('compressor', filtersSelectionMode.station)}
        >
          {compressorOptions}
        </CompressorSelect>
      )}
    </>
  ) : (
    <></>
  );
};
