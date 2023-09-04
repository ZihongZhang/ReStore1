import {
  Typography,
  Grid,
} from "@mui/material";
import { useFormContext } from "react-hook-form";
import AppTextInput from "../../app/components/AppTextInput";
import AppCheckbox from "../../app/components/AppCheckbox";

export default function AddressForm() {
  const { control, formState } = useFormContext();
  return (
    <>
      <Typography variant="h6" gutterBottom>
        Shipping address
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={12}>
          <AppTextInput control={control} label="Full name" name="fullName" />
        </Grid>

        <Grid item xs={12}>
          <AppTextInput control={control} label="Adress 1" name="address1" />
        </Grid>
        <Grid item xs={12}>
          <AppTextInput control={control} name="address2" label="Address 2" />
        </Grid>
        <Grid item xs={12} sm={6}>
          <AppTextInput control={control} name="city" label="City" />
        </Grid>
        <Grid item xs={12} sm={6}>
          <AppTextInput control={control} name="state" label="State" />
        </Grid>
        <Grid item xs={12} sm={6}>
          <AppTextInput control={control} name="zip" label="Zipcode" />
        </Grid>
        <Grid item xs={12} sm={6}>
          <AppTextInput control={control} name="country" label="Country" />
        </Grid>
        <Grid item xs={12}>
          <AppCheckbox
            disabled={!formState.isDirty}
            control={control}
            name="saveAddress"
            label="Use this address for payment details"
          />
        </Grid>
      </Grid>
    </>
  );
}
