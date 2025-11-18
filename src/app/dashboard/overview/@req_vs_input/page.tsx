import { delay } from '@/constants/mock-api';
import { RequestVsInputGraph } from '@/features/overview/components/request-vs-input-graph';

export default async function ReqVsInput() {
  await delay(1000);
  return <RequestVsInputGraph />;
}
