import * as React from "react";
import { useAutocomplete, UseAutocompleteProps } from "@mui/base/useAutocomplete";
import { Button } from "@mui/base/Button";
import { Popper } from "@mui/base/Popper";
import { unstable_useForkRef as useForkRef } from "@mui/utils";
import clsx from "clsx";
import { useState, useRef } from "react";
import { useDebounce } from "use-debounce";
import { ArrowDropDownIcon, ClearIcon, University, useFetchData } from "./";

interface AutocompleteProps extends UseAutocompleteProps<string, false, false, false> {
  fetchFn: (searchTerm: string) => Promise<University[]>;
}

const Autocomplete = React.forwardRef(function Autocomplete(
  props: AutocompleteProps,
  ref: React.ForwardedRef<HTMLDivElement>
) {
  const {
    fetchFn,
    disableClearable = false,
    disabled = false,
    readOnly = false,
    onChange,
    ...other
  } = props;

  const [state, setState] = useState({
    inputValue: "",
    debouncedInputValue: "",
    dropdownVisible: false,
    fetchAll: false,
  });

  const [debouncedInputValue] = useDebounce(state.inputValue, 500);
  const { data, isLoading, isError } = useFetchData(fetchFn, debouncedInputValue, state.fetchAll);

  const {
    getRootProps,
    getInputProps,
    getPopupIndicatorProps,
    getClearProps,
    getListboxProps,
    getOptionProps,
    id,
    popupOpen,
    focused,
    anchorEl,
    setAnchorEl,
  } = useAutocomplete({
    ...props,
    componentName: "BaseAutocompleteIntroduction",
    onInputChange: (_, newInputValue) => {
      setState((prevState) => ({
        ...prevState,
        inputValue: newInputValue,
        dropdownVisible: newInputValue.length > 0,
        fetchAll: prevState.fetchAll && false,
      }));
    },
    onChange: (event, newValue, reason, details) => {
      if (newValue) {
        setState((prevState) => ({
          ...prevState,
          inputValue: newValue,
          dropdownVisible: false,
        }));
        if (onChange) {
          onChange(event, newValue, reason, details);
        }
      }
    },
    isOptionEqualToValue: (option, value) => option === value,
  });

  const rootRef = useForkRef(ref, setAnchorEl);
  const iconRef = useRef<HTMLButtonElement>(null);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setState((prev) => ({
      ...prev,
      inputValue: value,
      debouncedInputValue: value,
    }));
    if (value === "") {
      setState((prev) => ({
        ...prev,
        fetchAll: true,
        dropdownVisible: true,
      }));
    } else {
      setState((prev) => ({
        ...prev,
        fetchAll: false,
        dropdownVisible: true,
      }));
    }
  };

  const toggleDropdownVisibility = () => {
    if (!state.dropdownVisible && state.inputValue === "") {
      setState((prev) => ({
        ...prev,
        fetchAll: true,
        dropdownVisible: !prev.dropdownVisible,
      }));
    }
  };

  const handleInputFocus = () => {
    if (state.inputValue.trim() === "") {
      setState((prev) => ({
        ...prev,
        fetchAll: true,
        dropdownVisible: true,
      }));
    }
  };

  const clearInput = () => {
    setState((prev) => ({
      ...prev,
      inputValue: "",
      debouncedInputValue: "",
      dropdownVisible: false,
    }));
  };

  const selectUniversity = (university: University) => {
    setState((prev) => ({
      ...prev,
      inputValue: university.name,
      dropdownVisible: false,
    }));
  };

  const highlightMatch = (text: string, highlight: string, country: string) => {
    const index = text.toLowerCase().indexOf(highlight.toLowerCase());
    if (index === -1) return text;
    return (
      <>
        {text.substring(0, index)}
        <span style={{ fontWeight: "bold" }}>{text.substring(index, index + highlight.length)}</span>
        {text.substring(index + highlight.length)}
        <span className="text-gray-500 ml-1">({country})</span>
      </>
    );
  };

  const handleIconClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (event.currentTarget === iconRef.current) {
      toggleDropdownVisibility();
    }
  };

  const handleInputClick = (event: React.MouseEvent<HTMLInputElement>) => {
    if (event.target === event.currentTarget) {
      setState((prev) => ({
        ...prev,
        dropdownVisible: true,
      }));
    }
  };

  const hasClearIcon = !disableClearable && !disabled && state.inputValue.length > 0 && !readOnly;

  return (
    <React.Fragment>
      <div className="fixed top-20 left-0 flex flex-col items-center justify-center w-full">
        <h1 className="text-black text-3xl font-thin font-serif mb-8">University Search</h1>
        <div
          {...getRootProps(other)}
          ref={rootRef}
          className={clsx(
            "flex gap-[5px] pr-[5px] overflow-hidden w-80 rounded-md bg-white bg-white-800 border border-violet-300 hover:border-violet-500 dark:hover:border-violet-500 focus-visible:outline-0",
            !focused && "shadow-sm",
            focused && "shadow-md"
          )}
        >
          <input
            id={id}
            disabled={disabled}
            readOnly={readOnly}
            {...getInputProps()}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onClick={handleInputClick}
            value={state.inputValue}
            className="text-sm leading-[1.5] text-black bg-inherit border-0 rounded-[inherit] px-3 py-2 outline-0 grow shrink-0 basis-auto"
          />
          {hasClearIcon && (
            <Button
              {...getClearProps()}
              className="self-center outline-0 shadow-none border-0 py-0 px-0.5 rounded-[4px] bg-transparent hover:bg-violet-100 hover:border-violet-300 hover:cursor-pointer"
              onClick={clearInput}
            >
              <ClearIcon className="translate-y-[2px] scale-90" />
            </Button>
          )}
          <Button
            ref={iconRef}
            {...getPopupIndicatorProps()}
            className="self-center outline-0 shadow-none border-0 py-0 px-0.5 rounded-md bg-transparent hover:bg-violet-100/30 hover:cursor-pointer"
            onClick={handleIconClick}
          >
            <ArrowDropDownIcon
              className={clsx(
                "translate-y-[1px] stroke-violet-500 transform transition-transform duration-100 ease-in-out scale-90 hover:stroke-violet-900",
                popupOpen && "rotate-180"
              )}
            />
          </Button>
        </div>
        {anchorEl && (
          <Popper
            open={popupOpen}
            anchorEl={anchorEl}
            slotProps={{
              root: { className: "relative z-[1001] w-80" },
            }}
            modifiers={[
              { name: "flip", enabled: false },
              { name: "preventOverflow", enabled: false },
            ]}
          >
            <ul
              {...getListboxProps()}
              className="text-sm box-border p-1.5 my-2 mx-0 min-w-[320px] rounded-md overflow-auto outline-0 max-h-[300px] z-[1] bg-white border border-violet-300 text-black shadow-md scrollbar-none"
            >
              {isLoading && (
                <li className="list-none p-2 cursor-default">Loading ...</li>
              )}
              {!isLoading && !isError && state.inputValue.length > 0 && data?.length === 0 && (
                <li className="list-none p-2 cursor-default text-red-500">
                  No results for{" "}
                  <span className="text-gray-600 font-thin font-serif">"{state.inputValue}"</span>
                </li>
              )}
              {!isLoading && !isError && data?.map((university: University, index: number) => {
                const optionProps = getOptionProps({ option: university.name, index });
                return (
                  <li
                    {...optionProps}
                    key={university.name}
                    className="list-none p-2 rounded-lg cursor-default last-of-type:border-b-0 hover:cursor-pointer aria-selected:bg-violet-100 dark:aria-selected:bg-violet-900 aria-selected:text-violet-900 dark:aria-selected:text-violet-100 ui-focused:bg-gray-100 dark:ui-focused:bg-gray-700 ui-focus-visible:bg-gray-100 dark:ui-focus-visible:bg-gray-800 ui-focused:text-gray-900 dark:ui-focused:text-gray-300 ui-focus-visible:text-gray-900 dark:ui-focus-visible:text-gray-300 ui-focus-visible:shadow-[0_0_0_3px_transparent] ui-focus-visible:shadow-violet-200 dark:ui-focus-visible:shadow-violet-500 ui-focused:aria-selected:bg-violet-100 dark:ui-focused:aria-selected:bg-violet-900 ui-focus-visible:aria-selected:bg-violet-100 dark:ui-focus-visible:aria-selected:bg-violet-900 ui-focused:aria-selected:text-violet-900 dark:ui-focused:aria-selected:text-violet-100 ui-focus-visible:aria-selected:text-violet-900 dark:ui-focus-visible:aria-selected:text-violet-100"
                    onClick={() => selectUniversity(university)}
                  >
                    {highlightMatch(university.name, state.inputValue, university.country)}
                  </li>
                );
              })}
            </ul>
          </Popper>
        )}
      </div>
    </React.Fragment>
  );
});

export default Autocomplete;
