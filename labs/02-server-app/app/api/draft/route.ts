import { draftMode } from 'next/headers'

export async function GET(request: Request) {
  const on = new URL(request.url).searchParams.get('on') !== '0'
  const draft = await draftMode()

  if (on) draft.enable()
  else draft.disable()

  console.log('📝 draftMode', on ? 'enable' : 'disable')
  return Response.json({ ok: true, enabled: on })
}
