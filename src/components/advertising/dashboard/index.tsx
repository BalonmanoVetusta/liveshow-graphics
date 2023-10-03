import { ShowAdvertisingInput } from "./form-elements/advertising-toggle-button";
import { InputTimeShowAdvertising } from "./form-elements/input-time-show-advertising";

export function AdvertisingDashboard() {
  return (
    <div>
      <h1>Advertising Dashboard</h1>
      <fieldset>
        <InputTimeShowAdvertising />
        <ShowAdvertisingInput />
      </fieldset>
    </div>
  );
}
