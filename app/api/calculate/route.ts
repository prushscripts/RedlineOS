import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'

// Add ANTHROPIC_API_KEY to Vercel environment variables before deploying

export async function POST(req: NextRequest) {
  try {
    const { grossPayment, driverPay, insurance, remainingAmount, weekLabel } = await req.json()

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: 'AI calculation unavailable. Check your API key in Vercel environment variables.' },
        { status: 500 }
      )
    }

    const client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY
    })

    const prompt = `You are a financial advisor for a small trucking business owner named James who is building toward $1,000,000 in profit. 

This week's numbers:
- Gross payment received: $${grossPayment}
- Driver pay (total): $${driverPay}
- Insurance set aside: $${insurance}
- Remaining amount to allocate: $${remainingAmount}
- Week: ${weekLabel}

James runs a 2-truck operation (Healey Route) and is aggressively saving toward $1M. He wants to build an emergency fund, pay himself, save for business growth, and set aside for truck maintenance.

Give James a specific dollar-amount allocation for the remaining $${remainingAmount} broken into these exact categories:
1. Self-pay (personal bank account / take home)
2. Business savings (growth fund)
3. Emergency fund
4. Truck maintenance reserve
5. Tax reserve (estimated quarterly taxes)
6. Miscellaneous buffer

Rules:
- All amounts must add up to exactly $${remainingAmount}
- Be specific with dollar amounts, no ranges
- CRITICAL TAX RULE - DO NOT DEVIATE: Always set aside exactly 30% of the remaining amount for taxes. This operator has a W2 job earning ~$57k/year AND this business income stacked on top. This means business profit is taxed at a higher marginal rate. He owes: federal self-employment tax (15.3%) + federal income tax at elevated bracket due to W2 stacking + NY state income tax (~6.5%). 30% is the minimum safe reserve. Never recommend below 30% for taxes under any circumstances. If 30% feels high, the weekly advice should reassure him that vehicle deductions, fuel, insurance, maintenance, and depreciation will reduce the actual tax bill at year end — but the reserve should stay at 30% until he files.
- Recommend at least 10-15% for maintenance reserve since trucks need upkeep
- Give James a realistic personal take-home
- Add one short sentence of advice for this week based on the numbers. If mentioning taxes, remind James that his W2 income stacks with business profit meaning his effective rate is higher than a typical sole operator, and that 30% is conservative on purpose — deductions for fuel, insurance, vehicle depreciation and maintenance will lower the actual bill at tax time.

Respond ONLY with a valid JSON object in this exact format, no other text:
{
  "allocations": [
    { "category": "Self-Pay (Take Home)", "amount": 0, "percentage": 0, "color": "#10B981" },
    { "category": "Business Savings", "amount": 0, "percentage": 0, "color": "#3B82F6" },
    { "category": "Emergency Fund", "amount": 0, "percentage": 0, "color": "#8B5CF6" },
    { "category": "Truck Maintenance", "amount": 0, "percentage": 0, "color": "#F59E0B" },
    { "category": "Tax Reserve", "amount": 0, "percentage": 0, "color": "#EF4444" },
    { "category": "Miscellaneous Buffer", "amount": 0, "percentage": 0, "color": "#64748B" }
  ],
  "weeklyAdvice": "One sentence of specific financial advice for this week.",
  "totalAllocated": 0
}`

    const message = await client.messages.create({
      model: 'claude-opus-4-20250514',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }]
    })

    const text = message.content[0].type === 'text' ? message.content[0].text : ''
    const clean = text.replace(/```json|```/g, '').trim()
    const result = JSON.parse(clean)

    // Ensure amounts add up exactly - adjust Misc Buffer if needed due to rounding
    const totalAllocated = result.allocations.reduce((sum: number, a: any) => sum + a.amount, 0)
    const difference = remainingAmount - totalAllocated
    
    if (Math.abs(difference) > 0.01) {
      const miscIndex = result.allocations.findIndex((a: any) => a.category === 'Miscellaneous Buffer')
      if (miscIndex !== -1) {
        result.allocations[miscIndex].amount += difference
        result.allocations[miscIndex].amount = Math.round(result.allocations[miscIndex].amount * 100) / 100
      }
    }

    result.totalAllocated = remainingAmount

    return NextResponse.json(result)
  } catch (error: any) {
    console.error('AI calculation error:', error)
    return NextResponse.json(
      { error: 'AI calculation unavailable. Check your API key in Vercel environment variables.' },
      { status: 500 }
    )
  }
}
