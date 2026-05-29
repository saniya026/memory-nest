import { Check, Circle } from 'lucide-react';

const STEPS = [
  { key: 'pending', label: 'Placed' },
  { key: 'paid', label: 'Paid' },
  { key: 'processing', label: 'Designing' },
  { key: 'completed', label: 'Ready' },
];

const ORDER = ['pending', 'paid', 'processing', 'completed'];

export default function OrderStatusTimeline({ status }) {
  if (status === 'cancelled') {
    return (
      <p className="mt-3 text-sm font-medium text-red-600 dark:text-red-400">This order was cancelled.</p>
    );
  }

  const currentIndex = ORDER.indexOf(status);
  const activeIndex = currentIndex === -1 ? 0 : currentIndex;

  return (
    <ol className="mt-4 flex items-center justify-between gap-1">
      {STEPS.map((step, i) => {
        const done = i < activeIndex || (i === activeIndex && status === 'completed');
        const current = i === activeIndex && status !== 'completed';
        return (
          <li key={step.key} className="flex flex-1 flex-col items-center gap-1">
            <span
              className={`flex h-7 w-7 items-center justify-center rounded-full text-xs ${
                done
                  ? 'bg-green-500 text-white'
                  : current
                    ? 'bg-rose text-white ring-2 ring-rose/30'
                    : 'bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
              }`}
            >
              {done ? <Check className="h-4 w-4" /> : <Circle className="h-3 w-3" />}
            </span>
            <span className={`text-center text-[10px] font-medium leading-tight sm:text-xs ${current ? 'text-rose' : 'text-gray-500'}`}>
              {step.label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
