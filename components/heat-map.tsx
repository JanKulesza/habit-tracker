import { Entry } from '@/generated/prisma/client'
import { formatEntriesByDate } from '@/lib/utils'
import { addDays, endOfWeek, format, isBefore, startOfWeek } from 'date-fns'
import { pl } from 'date-fns/locale'
import { ScrollArea, ScrollBar } from './ui/scroll-area'

interface HeatMapProps {
    startDate: Date
    endDate: Date
    entries: Entry[]
    habitsNum: number
}

export default function HeatMap({ startDate, endDate, entries, habitsNum }: HeatMapProps) {
    startDate = startOfWeek(startDate, { locale: pl });
    endDate = endOfWeek(endDate, { locale: pl })
    const entriesInPeriod = formatEntriesByDate(entries, startDate)
    let entriesArr: {
        date: Date,
        checked: boolean,
    }[] = [];

    for (let i = startDate; isBefore(i, endDate); i = addDays(i, 1)) {
        const entriesThisDay = entriesInPeriod[format(i, 'yyyy-MM-dd')]
        if (entriesThisDay && entriesThisDay.length > 0)
            entriesArr.push({
                date: i,
                checked: habitsNum > 1
                    ? entriesThisDay.length === habitsNum
                    : true,
            })
        else
            entriesArr.push({
                date: i,
                checked: false,
            })
    }

    return (
        <div className='flex'>
            <div className="flex flex-col justify-evenly text-xs mr-2 my-4 mt-6 text-muted-foreground">
                <span>Tue</span>
                <span>Thu</span>
                <span>Sat</span>
            </div>
            <ScrollArea className='w-full overflow-x-auto'>
                <div className='flex gap-1 mb-2'>
                    {entriesArr.map((_, idx) => {
                        if(idx % 7 !== 0)
                            return

                        if (idx >= 7 && idx % 7 === 0 && entriesArr[idx].date.getMonth() != entriesArr[idx - 7].date.getMonth()
                            || idx === 0 && entriesArr[0].date.getMonth() === entriesArr[7].date.getMonth())
                            return <span key={idx} className="text-muted-foreground text-xs w-3" >{format(entriesArr[idx].date, "MMM")}</span>
                        return <span key={idx} className='w-3'></span>
                    }
                    )}
                </div>
                <div className='grid grid-rows-7 grid-flow-col-dense gap-1 w-fit mb-4'>
                    {entriesArr.map(({ checked }, idx) =>
                        <div key={idx} className={`rounded-[3px] w-3 h-3 ${checked ? 'bg-primary' : 'bg-muted'}`} />
                    )}
                </div>
                 <ScrollBar orientation="horizontal" />
            </ScrollArea>
        </div>

    )
}
