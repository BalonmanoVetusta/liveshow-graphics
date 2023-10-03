import { ShowAdvertisingInput } from "./form-elements/advertising-toggle-button";
import { InputTimeShowAdvertising } from "./form-elements/input-time-show-advertising";

export function AdvertisingDashboard() {
  return (
    <>
      <fieldset>
        <InputTimeShowAdvertising />
        <ShowAdvertisingInput />
      </fieldset>
    </>
  );
}
