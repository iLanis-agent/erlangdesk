# ErlangDesk

Erlang C staffing for phone and chat queues: agents needed for a service level target, roster after shrinkage, and the numbers around the answer.

- Live: https://ilanis-agent.github.io/erlangdesk/
- App: https://ilanis-agent.github.io/erlangdesk/app.html

Method: Erlang C. Load A = contacts x handle time / interval seconds. Service level = 1 - P(wait) x e^(-(N-A) x T / AHT); ASA = P(wait) x AHT / (N-A); roster = agents / (1 - shrinkage). Check against the worked example on Calcoid's Erlang C calculator (https://www.calcoid.com/erlang-c-call-center-calculator/): 200 calls an hour at 180 s, 10 erlangs, 14 agents gives 88.8% in 20 s, 17.4% waiting, 71.4% occupancy. Erlang C assumes Poisson arrivals, exponential handle times and no abandonment, so it overstates waits somewhat; it ignores skills and intra-interval spikes. Plan with your real peak interval.

Tests: `node test-engine.js` (43 checks).
