// supabase/functions/send-notifications/index.ts
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')!
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)

Deno.serve(async () => {
  const { data: pending, error } = await supabase
    .from('notifications_queue')
    .select('id, recipient_id, type, payload, created_at')
    .eq('is_sent', false)
    .order('created_at', { ascending: true })
    .limit(200)

  if (error || !pending || pending.length === 0) {
    return new Response(JSON.stringify({ sent: 0 }), { status: 200 })
  }

  // Group by recipient — 5 new messages becomes 1 email, not 5
  const grouped = new Map<string, typeof pending>()
  for (const n of pending) {
    const list = grouped.get(n.recipient_id) ?? []
    list.push(n)
    grouped.set(n.recipient_id, list)
  }

  let sentCount = 0

  for (const [recipientId, items] of grouped) {
    const { data: recipient } = await supabase
      .from('profiles')
      .select('email, full_name')
      .eq('id', recipientId)
      .single()

    if (!recipient?.email) continue

    const messageItems = items.filter((i) => i.type === 'new_message')
    const todoItems = items.filter((i) => i.type === 'new_todo_list')
    const sections: string[] = []

    if (messageItems.length > 0) {
      const senders = [...new Set(messageItems.map((i: any) => i.payload.sender_name))]
      sections.push(
        `<p>You have ${messageItems.length} new message${messageItems.length > 1 ? 's' : ''} from ${senders.join(', ')}.</p>`
      )
    }

    if (todoItems.length > 0) {
      const list = todoItems
        .map((i: any) => `<li>${i.payload.list_title} (from ${i.payload.coach_name})</li>`)
        .join('')
      sections.push(`<p>New task list${todoItems.length > 1 ? 's' : ''} assigned:</p><ul>${list}</ul>`)
    }

    const html = `
      <div style="font-family: sans-serif; color: #334155;">
        <h2>Hi ${recipient.full_name},</h2>
        ${sections.join('')}
        <p><a href="https://yourapp.com/login" style="color: #7c3aed;">Open the app →</a></p>
      </div>
    `

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Coaching Platform <notifications@yourapp.com>',
        to: recipient.email,
        subject: 'You have updates on Coaching Platform',
        html,
      }),
    })

    if (res.ok) {
      const ids = items.map((i) => i.id)
      await supabase
        .from('notifications_queue')
        .update({ is_sent: true, sent_at: new Date().toISOString() })
        .in('id', ids)
      sentCount += ids.length
    }
  }

  return new Response(JSON.stringify({ sent: sentCount }), { status: 200 })
})