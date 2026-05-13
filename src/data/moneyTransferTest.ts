import { IELTSTest, Section } from '../types/ieltsTypes'

const passage1: Section = {
    id: 'money-transfer-p1',
    title: 'Reading Passage 1: Money Transfers by Mobile',
    content: `A. The ping of a text message has never sounded so sweet. In what is being touted as a world first, KenyaвЂ™s biggest mobile operator is allowing subscribers to send cash to other phone users by SMS. Known as M-Pesa, or mobile money, the service is expected to revolutionize banking in a country where more than 80% of people are excluded from the formal financial sector. Apart from transferring cash вЂ“ a service much in demand among urban Kenyans supporting relatives in rural areas вЂ“ customers of the Safaricom network will be able to keep up to 50,000 shillings (ВЈ370) in a "virtual account" on their handsets.

B. Developed by Vodafone, which holds a 35% share in Safaricom, M-Pesa was formally launched in Kenya two weeks ago. More than 10,000 people have signed up for the service, with around 8 million shillings transferred so far, mostly in tiny denominations. Safaricom's executives are confident that growth will be strong in Kenya, and later across Africa. "We are effectively giving people ATM cards without them ever having to open a real bank account," said Michael Joseph, chief executive of Safaricom, who called the money transfer concept the "next big thing" in mobile telephony.

C. M-Pesa is simple. There is no need for a new handset or SIM card. To send money, you hand over the cash to a registered agent вЂ“ typically a retailer вЂ“ who credits your virtual account. You then send between 100 shillings (74p) and 35,000 shillings (ВЈ258) via text message to the desired recipient вЂ“ even someone on a different mobile network вЂ“ who cashes it at an agent by entering a secret code and showing ID. A commission of up to 170 shillings (ВЈ1.25) is paid by the recipient but it compares favourably with fees levied by the major banks, whose services are too expensive for most of the population.

D. Mobile phone growth in Kenya, as in most of Africa, has been remarkable, even among the rural poor. In June 1999, Kenya had 15,000 mobile subscribers. Today, it has nearly 8 million out of a population of 35 million, and the two operators' networks are as extensive as the access to banks is limited. Safaricom says it is not so much competing with financial services companies as filling a void. In time, M-Pesa will allow people to borrow and repay money, and make purchases. Companies will be able to pay salaries directly into workers' phones вЂ“ something that has already attracted the interest of larger employers, such as the tea companies, whose workers often have to be paid in cash as they do not have bank accounts. There are concerns about security, but Safaricom insists that even if someone's phone is stolen, the PIN system prevents unauthorised withdrawals. Mr. Joseph said the only danger is sending cash to the wrong mobile number and the recipient redeeming it straight away.

E. The project is being watched closely by mobile operators around the world as a way of targeting the multibillion-pound international cash transfer industry, long dominated by companies such as Western Union and Moneygram. Remittances sent from nearly 200 million migrant workers to developing countries totalled ВЈ102 billion last year, according to the World Bank. The GSM Association, which represents more than 700 mobile operators worldwide, believes this could quadruple by 2012 if transfers by SMS become the norm. Vodafone has entered a partnership with Citigroup that will soon allow Kenyans in the UK to send money home via text message. The charge for sending ВЈ50 is expected to be about ВЈ3, less than a third of what some traditional services charge.`,
    questions: [
        {
            id: 'mt-q1', number: 1, type: 'matching-information',
            groupTitle: 'Questions 1-4',
            instruction: 'The text has 5 paragraphs (A - E). Which paragraph contains each of the following pieces of information?',
            text: 'A possible security problem',
            options: ['A', 'B', 'C', 'D', 'E'],
            correctAnswer: 'D',
            location: 'Paragraph D',
            explanation: 'Paragraph D mentions the danger of sending money to the wrong number: "...the only danger is sending cash to the wrong mobile number...".'
        },
        {
            id: 'mt-q2', number: 2, type: 'matching-information',
            text: 'The cost of M-Pesa',
            options: ['A', 'B', 'C', 'D', 'E'],
            correctAnswer: 'C',
            location: 'Paragraph C',
            explanation: 'Paragraph C provides details on commissions: "A commission of up to 170 shillings (ВЈ1.25) is paid...".'
        },
        {
            id: 'mt-q3', number: 3, type: 'matching-information',
            text: 'An international service similar to M-Pesa',
            options: ['A', 'B', 'C', 'D', 'E'],
            correctAnswer: 'E',
            location: 'Paragraph E',
            explanation: 'Paragraph E mentions Western Union and Moneygram: "...long dominated by companies such as Western Union and Moneygram.".'
        },
        {
            id: 'mt-q4', number: 4, type: 'matching-information',
            text: 'The fact that most Kenyans do not have a bank account',
            options: ['A', 'B', 'C', 'D', 'E'],
            correctAnswer: 'A',
            location: 'Paragraph A',
            explanation: 'Paragraph A states: "...more than 80% of people are excluded from the formal financial sector.".'
        },
        {
            id: 'mt-q5', number: 5, type: 'summary-completion',
            groupTitle: 'Questions 5-8',
            instruction: 'Complete the following sentences using NO MORE THAN THREE WORDS from the text for each gap.',
            text: 'Safaricom is the ______ mobile phone company in Kenya.',
            correctAnswer: 'biggest',
            location: 'Paragraph A',
            explanation: 'Paragraph A says: "...KenyaвЂ™s biggest mobile operator...".'
        },
        {
            id: 'mt-q6', number: 6, type: 'summary-completion',
            text: 'An M-Pesa account needs to be credited by ______.',
            correctAnswer: 'a registered agent',
            location: 'Paragraph C',
            explanation: 'Paragraph C states: "...you hand over the cash to a registered agent... who credits your virtual account.".'
        },
        {
            id: 'mt-q7', number: 7, type: 'summary-completion',
            text: '______ companies are particularly interested in using M-Pesa.',
            correctAnswer: 'Tea',
            location: 'Paragraph D',
            explanation: 'Paragraph D mentions: "...larger employers, such as the tea companies...".'
        },
        {
            id: 'mt-q8', number: 8, type: 'summary-completion',
            text: 'Companies like Moneygram and Western Union ______ the international money transfer market.',
            correctAnswer: 'dominate',
            location: 'Paragraph E',
            explanation: 'Paragraph E states: "...long dominated by companies such as Western Union and Moneygram.".'
        },
        {
            id: 'mt-q9', number: 9, type: 'true-false-not-given',
            groupTitle: 'Questions 9-13',
            instruction: 'Do the statements agree with the information given in Reading Passage 1? In boxes 9-13 on your answer sheet, write: TRUE, FALSE, NOT GIVEN.',
            text: 'Most Kenyans working in urban areas have relatives in rural areas.',
            correctAnswer: 'TRUE',
            location: 'Paragraph A',
            explanation: 'Paragraph A mentions: "...urban Kenyans supporting relatives in rural areas...", implying this group exists and is the target for the service.'
        },
        {
            id: 'mt-q10', number: 10, type: 'true-false-not-given',
            text: 'So far, most of the people using M-Pesa have used it to send small amounts of money.',
            correctAnswer: 'TRUE',
            location: 'Paragraph B',
            explanation: 'Paragraph B says: "...mostly in tiny denominations.".'
        },
        {
            id: 'mt-q11', number: 11, type: 'true-false-not-given',
            text: 'M-Pesa can only be used by people using one phone network.',
            correctAnswer: 'FALSE',
            location: 'Paragraph C',
            explanation: 'Paragraph C explains you can send to "someone on a different mobile network".'
        },
        {
            id: 'mt-q12', number: 12, type: 'true-false-not-given',
            text: 'M-Pesa can be used to buy products and services.',
            correctAnswer: 'NOT GIVEN',
            location: 'Paragraph D',
            explanation: 'Paragraph D says "In time, M-Pesa will allow people to... make purchases", suggesting it\'s a future capability, not necessarily currently available.'
        },
        {
            id: 'mt-q13', number: 13, type: 'true-false-not-given',
            text: 'The GSM Association is a consumer organisation.',
            correctAnswer: 'FALSE',
            location: 'Paragraph E',
            explanation: 'Paragraph E defines it as an association that "represents more than 700 mobile operators worldwide", not consumers.'
        }
    ]
}

const passage2: Section = {
    id: 'money-transfer-p2',
    title: 'Reading Passage 2: Park the Car Permanently',
    content: `A. More than a million people are likely to be disappointed by their experience of the GovernmentвЂ™s attempts to improve the democratic process. They may have signed an online petition against road pricing, but ministers are determined to push ahead with plans to make it more expensive to drive. The Government is convinced that this is the only way to reduce congestion and the environmental damage caused by motoring.

B. Why wait until you are forced off the road by costly charges? You may enjoy the convenience of your car, but the truth is that for huge numbers of people, owning a car makes little financial sense. YouвЂ™d be far better off giving it up and relying on other forms of transport. "IвЂ™m 47 and IвЂ™ve never owned a car, despite having a job that requires me to travel all over the South-East to visit clients," says Donnachadh McCarthy, an environmental expert who specialises in advising people how to be greener. "A car is a huge financial commitment, as well as being a psychological addiction. Not owning a vehicle is far more practical than most people realise."

C. It may seem as if cars have never been cheaper. After all, it is now possible to buy a brand new car for less than ВЈ4,000 - the Perodua Kelisa, if youвЂ™re interested. There are plenty of decent vehicles you can buy straight from the showroom for between ВЈ5,000 and ВЈ7,000. Of course, if you buy second-hand, the prices will be even lower. However, the falling purchase price of cars masks the fact that it has never been more expensive to own and run a vehicle. The estimate is that the cost of running a car rose by more than ten per cent last year alone. The annual cost of running your own vehicle is put at an average of ВЈ5,539, or ВЈ107 a week. While drivers who do less or more than the average mileage each year will spend correspondingly less or more, many of the costs of car ownership are fixed - and therefore unavoidable.

D. Depreciation - the fact that your vehicle loses a large chunk of its resale value each year - is one problem, accounting for ВЈ2,420 a year. The cost of finance packages, which most people have to resort to pay for at least part of the price of a new car, has also been rising - to an average of ВЈ1,040 a year. Then thereвЂ™s insurance, maintenance, tax, and breakdown insurance, all of which will cost you broadly the same amount, however many miles you do. Only fuel costs are truly variable. While petrol prices are the most visible indicator of the cost of running a car, for the typical driver they account for less than one-fifth of the total costs each year. In other words, leaving aside all the practical and psychological barriers to giving up your car, in financial terms, doing so makes sense for many people.

E. Take the cost of public transport, for example. In London, the most expensive city in the UK, the most expensive annual travel card, allowing travel in any zone at any time, costs just over ВЈ1,700. You could give up your car and still have thousands of pounds to spare to spend on occasional car hire. In fact, assuming that you have the most expensive travel card in London, you could hire a cheap car from a company, such as easyCar for about 30 weeks a year, and still be better off overall than if you owned your own vehicle. Not that car hire is necessarily the most cost-effective option for people who are prepared to do without a car but may still need to drive occasionally.

F. Streetcar, one of several "car clubs" with growing numbers of members, reckons that using its vehicles twice a week, every week, for a year, would cost you ВЈ700. Streetcar's model works very similarly to those of its main rivals, Citycarclub and Whizzgo. These three companies, which now operate in 20 of BritainвЂ™s towns and cities, charge their members a refundable deposit - ВЈ150 at Streetcar - and then provide them with an electronic smart card. This enables members to get into the vehicles, which are left parked in set locations, and the keys are then found in the glove compartment. Members pay an hourly rate for the car - ВЈ4.95 is the cost at Streetcar - and return it to the same spot, or to a different designated parking place.

G. Car sharing is an increasingly popular option for people making the same journeys regularly - to and from work, for example. Many companies run schemes that help colleagues who live near each other and work in the same place to contact each other so they can share the journey to work. Liftshare and Carshare are two national organisations that maintain online databases of people who would be prepared to team up. Other people may be able to replace part of all of their journey to work - or any journeys, for that matter - with low-cost transport such as a bicycle, or even by just walking. The more you can reduce your car use, however you gain access to it, the more you will save.`,
    questions: [
        {
            id: 'mt-q14', number: 14, type: 'matching-headings',
            groupTitle: 'Questions 14-17',
            instruction: 'Which paragraph does each of the following headings best fit?',
            text: 'Paragraph B',
            options: ['i. Join a club', 'ii. Don\'t wait!', 'iii. Team up', 'iv. Use public transport'],
            correctAnswer: 'ii. Don\'t wait!',
            location: 'Paragraph B',
            explanation: 'Paragraph B starts with "Why wait until you are forced off the road..." and encourages immediate action.'
        },
        {
            id: 'mt-q15', number: 15, type: 'matching-headings',
            text: 'Paragraph G',
            options: ['i. Join a club', 'ii. Don\'t wait!', 'iii. Team up', 'iv. Use public transport'],
            correctAnswer: 'iii. Team up',
            location: 'Paragraph G',
            explanation: 'Paragraph G discusses car sharing and database services that help people "team up" for regular journeys.'
        },
        {
            id: 'mt-q16', number: 16, type: 'matching-headings',
            text: 'Paragraph F',
            options: ['i. Join a club', 'ii. Don\'t wait!', 'iii. Team up', 'iv. Use public transport'],
            correctAnswer: 'i. Join a club',
            location: 'Paragraph F',
            explanation: 'Paragraph F focuses on specialized "car clubs" like Streetcar.'
        },
        {
            id: 'mt-q17', number: 17, type: 'matching-headings',
            text: 'Paragraph E',
            options: ['i. Join a club', 'ii. Don\'t wait!', 'iii. Team up', 'iv. Use public transport'],
            correctAnswer: 'iv. Use public transport',
            location: 'Paragraph E',
            explanation: 'Paragraph E compares car costs specifically with London travel card prices.'
        },
        {
            id: 'mt-q18-22',
            number: 18,
            type: 'five-true-statements',
            groupTitle: 'Questions 18-22',
            instruction: 'According to the text, FIVE of the following statements are true. Write the corresponding letters in answer boxes 18 to 22 in any order.',
            text: 'Select the five true statements (AвЂ“H).',
            options: [
                'A. McCarthy claims people can become addicted to using cars.',
                'B. The cost of using a car rose by over ten per cent last year.',
                'C. Most British people borrow money to help buy cars.',
                'D. Many people need cars to drive in London occasionally.',
                'E. Streetcar operates in over 20 cities in Britain.',
                'F. Streetcar\'s cars must be left at specific locations.',
                'G. Car sharing is becoming more popular with people who live and work near each other.',
                'H. The government wants to encourage people to go to work on foot or by bicycle.'
            ],
            correctAnswer: ['A', 'B', 'C', 'E', 'H'],
            explanation: 'A: Paragraph B; B: Paragraph C; C: Paragraph D; E: Paragraph F; H: Paragraph G.'
        },
        {
            id: 'mt-q23', number: 23, type: 'multiple-choice',
            groupTitle: 'Questions 23-26',
            instruction: 'For each question, only ONE of the choices is correct.',
            text: 'According to the information given in the text, the government has decided:',
            options: [
                'A. to stop road pricing.',
                'B. to listen to the online petition.',
                'C. to go ahead with charging drivers to use roads.',
                'D. to make it cheaper to drive.'
            ],
            correctAnswer: 'C. to go ahead with charging drivers to use roads.',
            explanation: 'Paragraph A states: "ministers are determined to push ahead with plans...".'
        },
        {
            id: 'mt-q24', number: 24, type: 'multiple-choice',
            text: 'Cars are often:',
            options: [
                'A. relatively cheap in Britain to buy.',
                'B. relatively expensive to operate in Britain.',
                'C. cheap to second-hand only.',
                'D. Both A and B'
            ],
            correctAnswer: 'D. Both A and B',
            explanation: 'Paragraph C says purchase prices are low but running costs are at an all-time high.'
        },
        {
            id: 'mt-q25', number: 25, type: 'multiple-choice',
            text: 'Fuel costs:',
            options: [
                'A. make up about 20% of the cost of running a car.',
                'B. are the most expensive part of car ownership.',
                'C. depend on how far you drive.',
                'D. Both A and C'
            ],
            correctAnswer: 'D. Both A and C',
            explanation: 'Paragraph D says fuel is less than 1/5th (20%) and is the only truly variable cost.'
        },
        {
            id: 'mt-q26', number: 26, type: 'multiple-choice',
            text: 'Using public transport:',
            options: [
                'A. is always more expensive than owning a car.',
                'B. and renting a car part of the time can save money.',
                'C. is only practical in London.',
                'D. prevents you from ever driving.'
            ],
            correctAnswer: 'B. and renting a car part of the time can save money.',
            explanation: 'Paragraph E shows that even with a London travel card, you are "better off overall" than owning a car.'
        }
    ]
}

const passage3: Section = {
    id: 'money-transfer-p3',
    title: 'Reading Passage 3: Low-Cost Lamps Light Rural India',
    content: `[Paragraph 1] Until three months ago, life in this humble village without electricity would come to a halt after sunset. Inside his mud-and-clay home, Ganpat JadhavвЂ™s three children used to study in the dim, smoky glow of a kerosene lamp, when their monthly fuel quota of four litres dried up in just a fortnight, they had to strain their eyes using the light from a cooking fire. That all changed with the installation of low-cost, energy-efficient lamps that are powered entirely by the sun. The lights were installed by the Grameen Surya Bijli Foundation (GSBF), an Indian non-governmental organisation focused on bringing light to rural India. Some 100,000 Indian villages do not yet have electricity. The GSBF lamps use LEDs - light emitting diodes - that are four times more efficient than a normal bulb. After a $55 installation cost, solar energy lights the lamp free of charge. LED lighting, like cell phones, is another example of a technology whose low cost could allow the rural poor to leap into the 21st century.

[Paragraph 2] As many as 1.5 billion people - nearly 80 million in India alone - light their houses using kerosene as the primary lighting media. The fuel is dangerous, dirty, and - despite being subsidised - consumes nearly four per cent of a typical rural Indian household's budget. A recent report by the Intermediate Technology Development Group suggests that indoor air pollution from such lighting media results in 1.6 million deaths worldwide every year. LED lamps, or more specifically white LEDs, are believed to produce nearly 200 times more useful light than a kerosene lamp and almost 50 times the amount of useful light of a conventional bulb. вЂњThis technology can light an entire rural village with less energy than that used by a single conventional 100-watt light bulb,вЂќ says Dave Irvine-Halliday, a professor of electrical engineering at the University of Calgary, Canada and the founder of Light up the World Foundation (LUTW). Founded in 1997, LUTW has used LED technology to bring light to nearly 10,000 homes in remote and disadvantaged corners of some 27 countries like India, Nepal, Sri Lanka, Bolivia, and the Philippines.

[Paragraph 3] The technology, which is not yet widely known in India, faces some scepticism here. вЂњLED systems are revolutionising rural lighting, but this isnвЂ™t a magic solution to the worldвЂ™s energy problems,вЂќ says Ashok Jhunjhunwala, head of the electrical engineering department at the Indian Institute of Technology, Madras. In a scenario in which nearly 60 per cent of IndiaвЂ™s rural population uses 180 million tons of biomass per year for cooking via primitive wood stoves - which are smoky and provide only 10-15 per cent efficiency in cooking - Jhunjhunwala emphasises the need for a clean energy source not just for lighting but for other domestic purposes as well. The Indian government in April launched an ambitious project to bring electricity to 112,000 rural villages in the next decade. However, the remote locations of the village will make reaching this goal difficult. A. K. Lakhina, the chairman of IndiaвЂ™s Rural Electrification Corporation, says the Indian government recognises the potential of LED lighting powered by solar technology, but expressed reservations about its high costs. вЂњIf only LEDs weren't imported but manufactured locally,вЂќ he says, вЂњand in bulk.вЂќ

[Paragraph 4] The lamps installed in nearly 300 homes by GSBF cost nearly half the price of other solar lighting systems. Jasjeet Singh Chaddha, the founder of the NGO, currently imports his LEDs from China. He wants to set up an LED manufacturing unit and a solar panel manufacturing unit in India. If manufactured locally, the cost of his LED lamp could plummet to $22, as they will not incur heavy import duties. вЂњWe need close to $5 million for this,вЂќ he says. Mr. Chaddha says he has also asked the government to exempt the lamps from such duties, but to no avail. An entrepreneur who made his money in plastics, Chaddha has poured his own money into the project, providing the initial installations free of charge. As he looks to make the project self-sustainable, he recognises that it is only urban markets - which have also shown an avid interest in LED lighting - that can pay. The rural markets in India cannot afford it, he says, until the prices are brought down. The rural markets would be able to afford it, says Mr. Irvine-Halliday, if they had access to microcredit. He says that in Tembisa, a shanty town in Johannesburg, he found that almost 10,000 homes spent more than $60 each on candles and paraffin every year. As calculations revealed, these families can afford to purchase a solid state lighting system in just over a year of paying per week what they would normally spend on candles and paraffin - if they have access to microcredit. LUTW is in the process of creating such a microcredit facility for South Africa.

[Paragraph 5] In villages near Khadakwadi, the newly installed LED lamps are a subject of envy, even for those connected to the grid. Those connected to the grid have to face power cuts up to 6 or 7 hours a day. Constant energy shortages and blackouts are a common problem due to a lack of power plants, transmission, and distribution losses caused by old technology and illegal stealing of electricity from the grid. LED systems require far less maintenance, a longer life, and as villagers jokingly say, вЂњno electricity bills.вЂќ The lamps provided by GSBF have enough power to provide just four hours of light a day. However, that is enough for people to get their work done in the early hours of night, and is more reliable than light generated from India's electric grid. Villagers are educated by GSBF officials to make the most of the new lamps. An official from GSBF instructs Jadhav and his family to clean the lamp regularly. вЂњIts luminosity and life will diminish if you let the dust settle on it,вЂќ he warns them.`,
    questions: [
        {
            id: 'mt-q27', number: 27, type: 'multiple-choice',
            groupTitle: 'Questions 27-30',
            instruction: 'Choose the correct letter A, B, C or D.',
            text: 'The GSBF lamps',
            options: ['A. are imported from China.', 'B. were developed by Dave Irvine-Halliday.', 'C. are four times as expensive as normal bulbs.', 'D. are powered by the sun.'],
            correctAnswer: 'D. are powered by the sun.',
            explanation: 'Paragraph 1 state they are "powered entirely by the sun".'
        },
        {
            id: 'mt-q28', number: 28, type: 'multiple-choice',
            text: 'More than half of India\'s population uses',
            options: ['A. kerosene for cooking.', 'B. biomass as a cooking fuel.', 'C. solar energy for cooking.', 'D. wood stoves with 60% efficiency.'],
            correctAnswer: 'B. biomass as a cooking fuel.',
            explanation: 'Paragraph 3 mentions "nearly 60 per cent of IndiaвЂ™s rural population uses... biomass".'
        },
        {
            id: 'mt-q29', number: 29, type: 'multiple-choice',
            text: 'In India, the GSBF lamps are too expensive for most people',
            options: ['A. in rural areas.', 'B. in urban areas.', 'C. who have access to microcredit.', 'D. who are connected to the grid.'],
            correctAnswer: 'A. in rural areas.',
            explanation: 'Paragraph 4 states "The rural markets in India cannot afford it...".'
        },
        {
            id: 'mt-q30', number: 30, type: 'multiple-choice',
            text: 'The GSBF lamps',
            options: ['A. need a lot of maintenance.', 'B. are more reliable than kerosene lamps.', 'C. give 200 times more light than conventional bulbs.', 'D. only provide four hours of light a day.'],
            correctAnswer: 'D. only provide four hours of light a day.',
            explanation: 'Paragraph 5 states "enough power to provide just four hours of light a day".'
        },
        {
            id: 'mt-q31', number: 31, type: 'summary-completion',
            groupTitle: 'Questions 31-35',
            instruction: 'Complete the following sentences using NO MORE THAN THREE WORDS from the text.',
            text: 'Another example of cheap technology helping poor people in the countryside is ______.',
            correctAnswer: 'cell phones',
            location: 'Paragraph 1',
            explanation: 'Paragraph 1: "LED lighting, like cell phones, is another example...".'
        },
        {
            id: 'mt-q32', number: 32, type: 'summary-completion',
            text: 'Kerosene lamps and conventional bulbs give off ______ useful light than GSBF lamps.',
            correctAnswer: 'less',
            location: 'Paragraph 2',
            explanation: 'Paragraph 2 compares them, showing LED produce much MORE light, thus others give LESS.'
        },
        {
            id: 'mt-q33', number: 33, type: 'summary-completion',
            text: 'It is unlikely that the Indian government will achieve its aim of connecting 112,000 villages to electricity because many villages are in ______.',
            correctAnswer: 'remote locations',
            location: 'Paragraph 3',
            explanation: 'Paragraph 3 attributes difficulty to "remote locations of the village".'
        },
        {
            id: 'mt-q34', number: 34, type: 'summary-completion',
            text: 'GSBF lamps would be cheaper if it werenвЂ™t for ______.',
            correctAnswer: 'heavy import duties',
            location: 'Paragraph 4',
            explanation: 'Paragraph 4 mentions costs would plumment if they did "not incur heavy import duties".'
        },
        {
            id: 'mt-q35', number: 35, type: 'summary-completion',
            text: 'Users need to wipe ______ from the LED in order to keep it working well.',
            correctAnswer: 'dust',
            location: 'Paragraph 5',
            explanation: 'Paragraph 5 instructs to "clean the lamp regularly" because "dust" settles on it.'
        },
        {
            id: 'mt-q36', number: 36, type: 'true-false-not-given',
            groupTitle: 'Questions 36-40',
            instruction: 'Do the following statements agree with the information given in the text?',
            text: 'Ganpat Jadhav\'s monthly ration of kerosene was insufficient.',
            correctAnswer: 'TRUE',
            location: 'Paragraph 1',
            explanation: 'Paragraph 1 says the quota "dried up in just a fortnight" (15 days), meaning it was insufficient for a month.'
        },
        {
            id: 'mt-q37', number: 37, type: 'true-false-not-given',
            text: 'Kerosene causes many fires in homes in developing countries.',
            correctAnswer: 'NOT GIVEN',
            location: 'Paragraph 2',
            explanation: 'Paragraph 2 mentions kerosene is "dangerous" but doesn\'t specifically discuss "fires in homes".'
        },
        {
            id: 'mt-q38', number: 38, type: 'true-false-not-given',
            text: 'LED systems could solve the world\'s energy problems.',
            correctAnswer: 'FALSE',
            location: 'Paragraph 3',
            explanation: 'Paragraph 3 states "this isnвЂ™t a magic solution to the worldвЂ™s energy problems".'
        },
        {
            id: 'mt-q39', number: 39, type: 'true-false-not-given',
            text: 'Chaddha has so far funded the GSBF lamp project himself.',
            correctAnswer: 'TRUE',
            location: 'Paragraph 4',
            explanation: 'Paragraph 4 says "Chaddha has poured his own money into the project".'
        },
        {
            id: 'mt-q40', number: 40, type: 'true-false-not-given',
            text: 'Microcredit would help to get more people to use LED lamps.',
            correctAnswer: 'TRUE',
            location: 'Paragraph 4',
            explanation: 'Paragraph 4 explicitly says accessibility would improve "if they had access to microcredit".'
        }
    ]
}

export const moneyTransferTest: IELTSTest = {
    id: 'ielts-reading-money-transfers',
    title: 'IELTS Academic Reading: Money Transfers & Social Impact',
    type: 'Academic',
    module: 'Reading',
    duration: 60,
    totalQuestions: 40,
    sections: [passage1, passage2, passage3]
}

