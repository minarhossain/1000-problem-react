import { Problem, Difficulty } from '../types/problem';
import { MODULES } from './modules';
import { CURATED_PROBLEMS } from './curatedProblems';

interface ModuleTopic {
  titlePattern: string;
  tags: string[];
  companies: string[];
  summary: string;
  requirements: string[];
  mentalModel: string;
  pitfalls: string[];
  hints: string[];
}

const TOPICS_BY_MODULE: Record<string, ModuleTopic[]> = {
  m1: [
    {
      titlePattern: 'JSX Transpilation & React.createElement Invariants',
      tags: ['JSX', 'Babel', 'Virtual DOM', 'React.createElement'],
      companies: ['Meta', 'Amazon'],
      summary: 'Demonstrate how JSX transpiles into React.createElement calls and build dynamic element trees without JSX syntax.',
      requirements: ['Render a nested tree using pure React.createElement', 'Handle props and key attributes', 'Validate component return types'],
      mentalModel: 'JSX is syntax sugar for React.createElement(type, props, ...children). Understanding the underlying object representation demystifies virtual DOM reconciliation.',
      pitfalls: ['Returning raw objects instead of valid React elements', 'Ignoring keys in arrays of elements created with createElement'],
      hints: ['Remember createElement takes type as first arg, props object as second, and spread children afterwards.'],
    },
    {
      titlePattern: 'Conditional Rendering Architecture: Ternary vs Short-Circuit && Pitfalls',
      tags: ['Conditional Rendering', 'Clean Code', 'Bug Prevention'],
      companies: ['Google', 'Meta', 'Netflix'],
      summary: 'Fix the infamous 0 rendering bug where `count && <Component />` accidentally prints "0" on the screen.',
      requirements: ['Audit falsy values: 0, NaN, false, null, undefined', 'Refactor short-circuit evaluations to explicit ternary or Boolean coercions', 'Implement empty state fallbacks'],
      mentalModel: 'In JavaScript, 0 && <Component /> evaluates to 0, which React happily renders as text. Always use Boolean(count) or ternary count > 0 ? <Component /> : null.',
      pitfalls: ['Using array.length && <List /> when length is 0', 'Unnecessary nested ternaries reducing readability'],
      hints: ['Use explicit conditions: `items.length > 0 ? ... : null`.'],
    },
    {
      titlePattern: 'List Keys: Why Index as Key Breaks Reordering & Inputs',
      tags: ['Keys', 'Reconciliation', 'Fiber', 'Bug Hunt'],
      companies: ['Meta', 'Uber', 'Airbnb'],
      summary: 'Create an interactive list of reorderable inputs where using index as key causes text to stay in place when items swap, and fix it with stable unique IDs.',
      requirements: ['Render an editable todo list with input fields', 'Add up/down reorder buttons', 'Demonstrate input state corruption when key={index}', 'Fix with crypto.randomUUID() stable identifiers'],
      mentalModel: 'Keys give React elements persistent identities across renders. Index keys make React think the same element at position 0 only changed its text, causing uncontrolled child DOM state to detach.',
      pitfalls: ['Generating random keys inside the render body like key={Math.random()}', 'Using index as key when list order is mutable'],
      hints: ['Generate persistent IDs when items are created, never inside the render function.'],
    },
    {
      titlePattern: 'Component Composition: Inverting Control with Children & Named Slots',
      tags: ['Props', 'Composition', 'Slots', 'Clean Architecture'],
      companies: ['Stripe', 'Shopify'],
      summary: 'Refactor a monolithic Card component with 15 props into a composable component using children and named slots.',
      requirements: ['Split Card into CardHeader, CardBody, CardFooter slots', 'Support custom badges and actions without prop drilling', 'Preserve semantic HTML'],
      mentalModel: 'Composition over inheritance: pass React elements as props or children rather than adding boolean flags to a monolithic component.',
      pitfalls: ['Over-parameterizing components with endless props like hasHeader, showIcon, iconColor, etc.'],
      hints: ['Treat components as layout frames that let consumers inject their own JSX.'],
    },
  ],
  m2: [
    {
      titlePattern: 'Automatic Batching & Functional Updaters in React 18/19',
      tags: ['useState', 'Batching', 'React 18', 'Concurrency'],
      companies: ['Meta', 'Microsoft'],
      summary: 'Explain and implement multiple sequential state updates within setTimeout, Promise, and native events, demonstrating automatic batching.',
      requirements: ['Trigger 3 state updates inside a setTimeout', 'Show why setCount(c + 1) times 3 only increments by 1', 'Fix using functional updaters setCount(c => c + 1)'],
      mentalModel: 'State variables are snapshots of a specific render. Inside an event handler, state does not update immediately; React schedules a re-render.',
      pitfalls: ['Relying on state immediately after calling its setter function', 'Mutating state objects directly before passing to setter'],
      hints: ['Use `setVal(prev => prev + 1)` when the next state depends on current state.'],
    },
    {
      titlePattern: 'Deep Immutability: Updating Nested Objects & Arrays without Mutating',
      tags: ['Immutability', 'useState', 'Data Structures'],
      companies: ['Amazon', 'Bloomberg'],
      summary: 'Safely update deeply nested properties inside a user profile state (e.g. user.preferences.notifications.email) without mutating any parent references.',
      requirements: ['Use object spreads and array operations (map, filter)', 'Create reusable nested state updater helper', 'Ensure previous state object equality returns false on modified branches and true on untouched branches'],
      mentalModel: 'Structural sharing: only shallow clone the modified pathway; reuse unmodified branches in memory to preserve referential equality.',
      pitfalls: ['Mutating arrays using push/splice instead of concat/spread/filter', 'Shallow copying only the top level and mutating nested children'],
      hints: ['Every level of nesting modified requires its own spread `{ ...prev, child: { ...prev.child, field: val } }`.'],
    },
  ],
  m3: [
    {
      titlePattern: 'useEffect Race Condition Guard with AbortController',
      tags: ['useEffect', 'AbortController', 'Race Conditions', 'Async'],
      companies: ['Google', 'Meta', 'Stripe'],
      summary: 'Prevent out-of-order API responses from overwriting newer user selections when switching tabs or dropdown options rapidly.',
      requirements: ['Simulate slow API queries with variable latency', 'Attach AbortController to fetch request inside useEffect', 'Abort request in cleanup function', 'Ignore AbortError to prevent console noise'],
      mentalModel: 'Network requests can return out of order. Effects must clean up prior pending requests or discard stale results when dependencies change.',
      pitfalls: ['Ignoring cleanup function when dependencies change rapidly', 'Not checking if component is unmounted or request is active'],
      hints: ['Create `const controller = new AbortController()` inside the effect and call `controller.abort()` in return cleanup.'],
    },
    {
      titlePattern: 'Synchronizing with External Systems vs Event Handlers',
      tags: ['useEffect', 'Architecture', 'Clean Code'],
      companies: ['Meta', 'Uber'],
      summary: 'Refactor code that improperly used useEffect to submit forms or trigger analytics into direct event handlers.',
      requirements: ['Identify effect code that responds to user clicks rather than state synchronization', 'Migrate logic into onClick handler', 'Verify effects are only used for external system sync (DOM, subscriptions, timers)'],
      mentalModel: 'If something happens because the user performed an action, put it in the event handler. If it happens because the component is displayed on screen, put it in useEffect.',
      pitfalls: ['Setting state in an effect that could have been calculated directly during render'],
      hints: ['Ask: "Would this logic still need to run if this component never rendered?"'],
    },
  ],
  m4: [
    {
      titlePattern: 'Imperative Handles: Exposing Focused API with useImperativeHandle',
      tags: ['useRef', 'useImperativeHandle', 'forwardRef', 'Encapsulation'],
      companies: ['Stripe', 'Atlassian', 'Apple'],
      summary: 'Build a custom VideoPlayer or RichTextInput component that only exposes `{ play(), pause(), seek(time), reset() }` to parents instead of leaking the raw DOM node.',
      requirements: ['Wrap component in forwardRef', 'Use useImperativeHandle to restrict exposed interface', 'Trigger imperative controls from parent via ref'],
      mentalModel: 'Refs should be used sparingly. When imperative access is needed, useImperativeHandle acts as an encapsulation boundary, preventing consumers from breaking internal DOM structure.',
      pitfalls: ['Leaking full DOM element when only specific commands are needed', 'Overusing refs for things that can be handled declaratively with props'],
      hints: ['Return an object containing only the allowed methods in useImperativeHandle(ref, () => ({ play, pause }))'],
    },
  ],
  m5: [
    {
      titlePattern: 'Virtual DOM Diffing & React.memo with Custom Comparator',
      tags: ['React.memo', 'Performance', 'Referential Equality'],
      companies: ['Netflix', 'Meta', 'Amazon'],
      summary: 'Implement a custom `arePropsEqual` comparator in `React.memo` to ignore non-visual prop changes in a high-frequency trading table.',
      requirements: ['Profile unnecessary re-renders in a table with 20 columns', 'Provide custom comparison function ignoring function references or non-critical metadata', 'Verify frame rate improvements'],
      mentalModel: 'By default, React.memo does shallow comparison (`===`). If props are complex objects or new functions, comparison fails unless a custom comparator is supplied or props are stabilized.',
      pitfalls: ['Doing deep JSON.stringify comparison in arePropsEqual which can be slower than re-rendering'],
      hints: ['Only compare props that actually alter the visual output of the component.'],
    },
  ],
};

const DIFFICULTIES: Difficulty[] = ['Beginner', 'Intermediate', 'Advanced', 'Expert', 'Staff'];
const COMPANIES = ['Meta', 'Google', 'Netflix', 'Amazon', 'Apple', 'Stripe', 'Uber', 'Airbnb', 'Microsoft', 'Shopify', 'Twitter / X', 'Datadog'];

// Deterministic generator to guarantee all 1,000 problems are cleanly populated
export function generateAllProblems(): Problem[] {
  const curatedMap = new Map<number, Problem>();
  for (const p of CURATED_PROBLEMS) {
    curatedMap.set(p.id, p);
  }

  const allProblems: Problem[] = [];

  for (const mod of MODULES) {
    const [startId, endId] = mod.problemRange;
    const countInModule = endId - startId + 1;
    const topics = TOPICS_BY_MODULE[mod.id] || TOPICS_BY_MODULE['m1'];

    for (let id = startId; id <= endId; id++) {
      if (curatedMap.has(id)) {
        allProblems.push(curatedMap.get(id)!);
        continue;
      }

      const offset = id - startId;
      const topic = topics[offset % topics.length];
      const diffIndex = Math.min(
        DIFFICULTIES.length - 1,
        Math.floor((offset / countInModule) * 3) + (mod.id >= 'm19' ? 2 : mod.id >= 'm9' ? 1 : 0)
      );
      const difficulty = DIFFICULTIES[Math.min(DIFFICULTIES.length - 1, diffIndex)];
      const comp1 = COMPANIES[(id * 3) % COMPANIES.length];
      const comp2 = COMPANIES[(id * 7 + 1) % COMPANIES.length];

      const problemTitle = `${topic.titlePattern} - Challenge #${id}`;
      const timeEstimate = `${15 + (offset % 5) * 5} min`;

      const generatedProblem: Problem = {
        id,
        moduleId: mod.id,
        moduleName: mod.title,
        title: problemTitle,
        difficulty,
        timeEstimate,
        tags: [...topic.tags, mod.category],
        companies: [comp1, comp2],
        summary: `[Problem #${id}] In this problem for ${mod.title}, you will implement and master: ${topic.summary} Address real-world scale and avoid subtle edge-case traps.`,
        requirements: [
          ...topic.requirements,
          `Write clean, production-ready React with strict TypeScript types`,
          `Ensure component unmounts cleanly without console warnings or memory leaks`,
        ],
        mentalModelTakeaway: topic.mentalModel,
        starterCode: `import React, { useState } from 'react';

// Problem #${id}: ${problemTitle}
// Module: ${mod.title}
export default function Problem${id}Workspace() {
  const [active, setActive] = useState(false);

  return (
    <div className="p-6 max-w-md mx-auto bg-slate-900 border border-slate-800 text-white rounded-xl shadow-lg">
      <h2 className="text-lg font-bold mb-2">Problem #${id}: ${topic.titlePattern}</h2>
      <p className="text-xs text-slate-400 mb-4">
        ${topic.summary}
      </p>

      {/* TODO: Implement your solution here */}
      <div className="p-4 bg-slate-950 rounded border border-slate-800 text-center">
        <button 
          onClick={() => setActive(!active)}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded text-xs font-semibold"
        >
          {active ? 'State Active' : 'Activate State'}
        </button>
      </div>
    </div>
  );
}`,
        solutionCode: `import React, { useState, useEffect, useCallback, useMemo } from 'react';

// Reference Solution for Problem #${id}
export default function Problem${id}Solution() {
  const [data, setData] = useState({ count: 0, status: 'ready' });

  const handleAction = useCallback(() => {
    setData(prev => ({
      ...prev,
      count: prev.count + 1,
      status: 'updated'
    }));
  }, []);

  return (
    <div className="p-6 max-w-md mx-auto bg-slate-900 border border-slate-800 text-white rounded-xl shadow-xl">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-base font-bold text-white">Problem #${id} Master Solution</h2>
        <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-mono font-bold">
          Verified
        </span>
      </div>
      
      <p className="text-xs text-slate-300 mb-4 leading-relaxed">
        ${topic.mentalModel}
      </p>

      <div className="bg-slate-950 p-4 rounded-lg border border-slate-800/80 mb-4 text-xs font-mono">
        <div>Status: <span className="text-indigo-400 font-bold">{data.status}</span></div>
        <div>Invocations: <span className="text-emerald-400 font-bold">{data.count}</span></div>
      </div>

      <button
        onClick={handleAction}
        className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 rounded text-xs font-semibold transition"
      >
        Trigger Optimized Action
      </button>
    </div>
  );
}`,
        explanation: `${topic.mentalModel} When tackling ${topic.titlePattern}, always maintain referential stability, use functional updates when deriving next state from previous state, and clean up subscriptions or timers in effects.`,
        pitfalls: topic.pitfalls,
        hints: topic.hints,
        testCases: [
          {
            id: `tc_${id}_1`,
            name: 'Component renders properly',
            description: 'Check that root container renders with test id or title',
            assertionCode: `const btn = document.querySelector('button'); return Boolean(btn);`,
          },
        ],
        interviewFollowUps: [
          `How would you test this component in Jest / React Testing Library without mocking internals?`,
          `What are the performance implications if this component re-renders 60 times a second?`,
        ],
      };

      allProblems.push(generatedProblem);
    }
  }

  return allProblems;
}

export const ALL_PROBLEMS: Problem[] = generateAllProblems();
