import { Suspense } from "react";
// import { bundleName, nodecgEndpoint } from "services/global-variables";

// const fetchFederations = async () =>
//   fetch(`${nodecgEndpoint}/${bundleName}/assets/static-data/federations.json`)
//     .then((res) => res.json())
//     .catch(() => []);

export function AutoGoalsDashboard() {
  return (
    <div>
      <h1>AutoGoalsDashboard</h1>
      <fieldset>
        <legend>Federation</legend>
        <select name="federation" id="federationSelectId">
          <optgroup label="Federations">
            <Suspense fallback={<option disabled>Loading...</option>}>{/* TODO */}</Suspense>
          </optgroup>
        </select>
      </fieldset>
    </div>
  );
}
