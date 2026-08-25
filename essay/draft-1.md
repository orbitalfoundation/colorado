# Who Drinks the River?

*DRAFT 1 for Anselm's revision. Bracketed slots are places only he can fill.
Every number is verified against the sources in docs/verification.md. The
interactive model is at https://colorado.exe.xyz and the source at
github.com/orbitalfoundation/colorado.*

---

Somewhere in your feed this year you probably saw the claim: every year we
drain more than half of the Colorado River to grow feed for cattle. Maybe it
came with the Sankey diagram, the river fanning out into ribbons of alfalfa
and hay. Maybe it came with the replies: that the real problem is almonds, or
lawns, or data centers, or that farmers are heroes and the cities should dry
up first, or that we could simply buy the farmers out and be done with it.

How did reading that make you feel? Angry at someone? Which someone? Did you
share it? Did you believe it? A year from now, when the same fight comes
around again, will anything have changed except the usernames?

[OPTIONAL: one or two sentences from Anselm about the specific moment this
fight crossed his feed and what it stirred.]

I have been circling this problem for a decade. In 2015 I wrote, on a site
called simulate.world, that digital simulations were becoming how societies
make their big decisions, and that "right now they are the playthings of an
elite." Weather models, catastrophe models, economic models: powerful lenses,
pointed by very few hands. I believed ordinary people should be able to test
worlds before committing to live in them, and I set out to build that as a
platform, a sandbox where anyone could assemble their own model of anything.

The sandbox nearly buried me. A general tool for non-experts is an enormous
amount of labor, and all of its payoff arrives at the end, if anyone shows
up. Meanwhile the machines were improving underneath me. Whatever authoring
tools I built this year looked likely to be obsolete before they mattered,
while the domain work, the actual water accounting and the argument
structure, would hold its value no matter what. The sims are the durable
asset. The tooling is the disposable part. That inversion took me
embarrassingly long to accept.

So I am trying something smaller and, I think, more honest: standalone
pieces. One live public argument, one open model, one page you can play
with, shipped together. Call it computational journalism. The discipline is
in the topic selection: only fights where a model can actually settle
something. A border wall argument is a values fight wearing a costume of
facts, and a model there would just be advocacy with equations. Water is the
opposite case. Water is conserved. It is measured. Nobody argues their way
out of a mass balance. The piece you are reading is the first of these, and
by the end of it I am going to hand you the controls.

First the fact that reorganizes everything else.

## The ledger does not balance

In 1922 the seven basin states divided the Colorado on paper: 7.5 million
acre-feet a year to the Upper Basin, 7.5 million to the Lower. In 1944 a
treaty promised Mexico another 1.5 million. Call it 16.5 million acre-feet of
promises, and the compact holds an option on another million for the Lower
Basin in good years.

The river never agreed to this. The negotiators used flow estimates from an
unusually wet stretch of years. Reclamation's own reconstruction of natural
flow at Lees Ferry, the dividing point between the basins, averages 15.2
million acre-feet a year over the twentieth century (1906 to 1999). Since
2000 it averages 12.4. The promises exceed the water by roughly a third, and
they have for a century.

This is why the Colorado has not regularly reached the sea since 1960. The
delta in Mexico, once a vast wetland, is dry except when engineered pulse
flows are negotiated for it, as in 2014, when 105,000 acre-feet crossed the
border and the river touched the Gulf of California for the first time in
thirteen years. Nobody is stealing the water. Everyone is taking their legal
share, and the legal shares add up to more than there is. The shortfall
simply lands on whoever has no paper: the delta, and increasingly the
reservoirs, which spent two decades papering over the deficit by draining
themselves.

## Two cows and a denominator

So is the cattle-feed claim true? Mostly, and the interesting part is where
it bends.

The number comes from Richter and colleagues' 2024 accounting
(https://doi.org/10.1038/s43247-024-01291-0), the most complete water budget
the river has ever had. Alfalfa and other hays are 46 percent of direct
human consumptive use. Count everything, including reservoir evaporation and
the water that riparian vegetation breathes out, and cattle feed is 32
percent of total consumption. Half the water humans take, a third of the
whole river. The claim survives, provided you say which denominator you mean,
and almost nobody does.

Here is where it gets stranger. There is a well-loved podcast episode, Future
Ecologies' "Home on the Rangelands," that makes a genuinely good case that
cattle grazing is one of the better conservation tools California has:
grazing knocks back invasive annual grasses, stock ponds shelter endangered
salamanders, ranchland holds the line against subdivision. People cite it in
these arguments as a defense of the cows. But that episode is about rain-fed
rangeland, which takes essentially nothing from the river. The Colorado's
water goes to a different cow: the one eating irrigated desert alfalfa on its
way to a dairy or a feedlot. Same animal, two separate water stories. An
argument about one is routinely spent defending the other.

And the economics are stranger still. The line you hear is that alfalfa is
worth tens of dollars per acre-foot of water, which would make it absurd.
That number is actually the price of the water itself, roughly twenty
dollars an acre-foot in the Imperial Valley. The crop's revenue runs from
about 170 dollars per acre-foot in California's accounting up to 450 in a
good hay year in Arizona. Meanwhile the federal government has been paying
farmers 330 to 418 dollars per acre-foot to temporarily fallow fields and
leave the water in Lake Mead. Sit with those numbers for a moment. Growing
the hay and being paid not to grow it are within arm's reach of each other.
The margin between them is thin enough that policy, not physics, decides
which one happens.

## Why the obvious fix keeps failing

If the water is worth so little, why not buy the farmers out? Two mechanical
facts, before any politics.

A water right is measured at the point of diversion, but a farm only consumes
part of what it diverts; the rest returns to the river and someone downstream
is already using it. Retire a right to five acre-feet and you might free
three of actual wet water. Every buyout budget shrinks on contact with this
arithmetic.

The second fact has a name: Crowley County, Colorado. In the 1970s and 80s
its farmers sold their canal shares to the growing Front Range cities. More
than 50,000 irrigated acres fell to about 2,500. The county never recovered;
by 2011 nearly half its residents lived in poverty, and its main industries
today are ranching and two prisons. The lesson is not that water should
never move. It is that permanent retirement and a fallow year are different
instruments entirely. Fields can rest and come back. A packing shed, a
dairy, an equipment dealer, a school district: these decay when the water
leaves and do not return when it does. Acre-feet are reversible. Communities
are not.

## The fight now has a schedule

The rules that managed shortage on the river expire at the end of this year.
The seven states spent years negotiating their replacement and could not
agree. So on August 21, 2026, three days after Lake Mead set its all-time
record low, the Interior Department imposed a framework of its own: ten
years, 2027 through 2036, with operating rules revisited every two years.
The first round of cuts uses a split the Lower Basin states negotiated for
themselves; past 1.5 million acre-feet of shortage, the law of seniority
takes over.

Read that structure again. Every two years, for a decade, this argument
reruns with real water at stake. The fight you saw in your feed is not a
one-time controversy. It is now a standing appointment.

## The instrument

So I built the beginning of one:
https://colorado.exe.xyz

It is an annual mass balance of the river, running live in your browser. The
consumption side comes from the Richter accounting; the supply side is
Reclamation's natural-flow record back to 1906; the model reproduces the
published numbers before it is allowed to say anything else, and its one
calibrated parameter sits inside the range hydrology expects. You get a dial
for the river's flow and a choice of allocation rules: share the pain
proportionally, follow seniority, or use the framework the government just
adopted. The model shows you the reservoirs' trajectory and who takes the
cut.

Some things you will notice quickly. Hold demand where it is and give the
river its average flow of the last 25 years, and the reservoirs still grind
toward empty within a couple of decades, because a refilling reservoir
evaporates more. Recovery needs wet years or cuts; there is no third
setting. Choose seniority and Arizona is erased while California loses
nothing, which is not an opinion about Arizona, it is what the 1968 law
says. Choose proportional and everyone hurts moderately, which no one's
lawyers will accept. Is there a setting where nobody is harmed? I have not
found one. If you find it, the link button serializes your whole scenario
into a URL. Send it to me. Send it to whoever you were arguing with.

The model is small and honest about it: four parties where reality has
hundreds, a stylized seniority rule, no groundwater yet, no crop economics
yet. The source and every data pipeline are public, so when you think it is
wrong, and somewhere it surely is, you can say so specifically.

## Keeping futures open

Prior appropriation, first in time, first in right, was a sensible rule for
1870s Colorado: it let strangers invest along a river without a government
to referee them. The rule outlived its world. Seniority now bears no
relation to value, to population, to food security, or to any future anyone
would choose on purpose. Nobody acted in bad faith. An institution simply
fossilized while the climate moved, and now three days after a record low,
the arguments in our feeds are still about whose cow is drinking.

[OPTIONAL: Anselm's closing register, one short paragraph. The thread I
would offer: the point of civic modeling is that futures stay open when
ordinary people can check the arithmetic themselves rather than choosing
which expert to believe. A model you can play with is a small piece of that.]

If this works even a little, it is a repeatable shape. The same treaty that
governs the Colorado governs the Rio Grande, where Mexico fell a year of
deliveries behind and the Supreme Court just settled a thirteen-year fight
over New Mexico's groundwater; one engine, two stories. Behind those wait
the Ogallala, the Great Salt Lake, the sinking Central Valley. My hope for
the approach is modest and specific: not that a model ends an argument, but
that it gives the argument a floor. When the flow number, the denominator,
and the seniority rule are things anyone can check and push on, the fight
that remains is the real one, about values and who pays, and that fight is
worth having.

The river is over-promised by a third, everyone serious already agrees
consumption must fall, and the only live questions are who cuts, how
permanently, and who pays. Those are exactly the questions a model can hold
still long enough for people to argue about honestly. Go play with it. Tell
me where it is wrong. That is the point.
