import { GetViewConfigArgs } from "../../../server/api/getViewConfiguration";
import { ViewConfigurationType } from "../../../types/schemas";
import { viewConfigurations } from "../data/viewConfigurations";
import sleep from "../sleep";

export async function getViewConfiguration({
  id,
}: GetViewConfigArgs): Promise<ViewConfigurationType> {
  console.log("getting view configuration for viewId:", id);
  await sleep();

  /** @type {ViewConfiguration} */
  const mockResponse = viewConfigurations.find((config) => config.id === id);

  return JSON.parse(JSON.stringify(mockResponse));
}
