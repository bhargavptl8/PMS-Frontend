import { Autocomplete, Box, FormControl, FormHelperText, IconButton, InputAdornment, InputLabel, MenuItem, OutlinedInput, Select, TextField } from "@mui/material";
import { DesktopDatePicker } from "@mui/x-date-pickers";
import { Controller } from "react-hook-form";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useState } from "react";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

export const CustomTextField = ({ label, name, autoComplete, type, id, autoFocus, control, required, ...rest }) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, formState: { errors } }) => <TextField {...field} fullWidth required={required} label={label} name={name} autoComplete={autoComplete} type={type} id={id} autoFocus={autoFocus} error={!!errors[name]} helperText={errors[name]?.message} {...rest} />}
    />
  )
}

export const CustomPasswordField = ({
  label,
  name,
  control,
  required,
  ...rest
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = (event) => event.preventDefault();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, formState: { errors } }) => (
        <FormControl
          variant="outlined"
          fullWidth
          error={!!errors[name]}
          required={required}
          {...rest}
        >
          <InputLabel htmlFor={name}>{label}</InputLabel>
          <OutlinedInput
            {...field}
            id={name}
            type={showPassword ? 'text' : 'password'}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label={
                    showPassword ? 'hide the password' : 'display the password'
                  }
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label={label}
          />
          {errors[name] && (
            <FormHelperText>{errors[name]?.message}</FormHelperText>
          )}
        </FormControl>
      )}
    />
  );
};

export const CustomDatePicker = ({ name, label, control }) => {

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <DesktopDatePicker
              {...field}
              sx={{ width: "100%" }}
              label={label}
              value={field.value || null}
              onChange={(date) => field.onChange(date)}
              slotProps={{
                field: {
                  clearable: true,
                },
              }}
            />
          )}
        />
      </Box>
    </LocalizationProvider>
  );
};

export const CustomNumberField = ({
  label,
  name,
  control,
  required,
  id,
  setError, clearErrors
}) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          id={id}
          {...field}
          required={required}
          label={label}
          fullWidth
          error={!!error}
          helperText={
            error?.message
          }
          onChange={(e) => {
            const value = e.target.value;
            if (/^\d*$/.test(value)) {
              field.onChange(value); // Update value if it's numeric
              clearErrors(name);
            } else {
              // field.onChange(""); // Clear the field if input isn't numeric
              setError(name, { type: "manual", message: "Only numbers are allowed" }); // Set a custom error
            }
          }}
          inputProps={{
            inputMode: "numeric",
          }}
        />
      )}
    />
  );
};

export const CustomSelectFiled = ({ label,
  name,
  control,
  required,
  id,
  options = [], }) => {
  return (
    <FormControl fullWidth>
      <InputLabel id={id}>{label}</InputLabel>
      <Controller
        name={name}
        control={control}
        render={({ field, formState: { errors } }) =>
          <>
            <Select
              id={id}
              sx={{
                width: "100%"
              }}
              {...field} fullWidth required={required} label={label} name={name}>
              {options.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
            {/* {
              console.log("error============", errors[name])

            } */}
            {errors[name] && <FormHelperText sx={{
              color: '#d32f2f'
            }}>{errors[name]?.message}</FormHelperText>}
          </>
        }
      />
    </FormControl>
  )
}

// export const CustomMultiSelectFiled = ({ label,
//   name,
//   control,
//   required,
//   id,
//   options = [], }) => {
//   return (
//     <FormControl fullWidth>
//       <InputLabel id={id}>{label}</InputLabel>
//       <Controller
//         name={name}
//         control={control}
//         render={({ field, formState: { errors } }) =>
//           <>
//             <Select
//               multiple
//               id={id}
//               sx={{
//                 width: "100%"
//               }}
//               {...field} fullWidth required={required} label={label} name={name}>
//               {options?.map((option) => (
//                 <MenuItem key={option?.key} value={option?.id}>
//                   {option?.key}
//                 </MenuItem>
//               ))}
//             </Select>
//             {
//               console.log("error============", errors[name])

//             }
//             {errors[name] && <FormHelperText sx={{
//               color: '#d32f2f'
//             }}>{errors[name]?.message}</FormHelperText>}
//           </>
//         }
//       />
//     </FormControl>
//   )
// }


export const CustomMultiSelectFiled = ({ name, control, label, id, options = [], clientsValue, setClientsValue }) => {
  return <Controller
    name={name}
    control={control}
    render={({ field, formState: { errors } }) => {
      { console.log(errors) }
      return <Autocomplete
        fullWidth
        sx={{
          width: '100%!important'
        }}
        {...field}
        multiple
        id={id}
        options={options}
        getOptionLabel={(option) => option?.key}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        onChange={(event, value) => {
          field.onChange(value);
          setClientsValue(value)
        }} // Update form state
        value={clientsValue} // Ensure it's always controlled
        renderInput={(params) => (
          <TextField {...params} label={label} placeholder="Select Favorites" fullWidth error={!!errors[name]} helperText={errors[name]?.message} />
        )}
      />
    }}
  />
}


