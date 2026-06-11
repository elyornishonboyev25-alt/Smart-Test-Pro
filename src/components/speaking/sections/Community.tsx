import SpeakerDirectory from '@/components/speaking/SpeakerDirectory'
import { Reveal } from '@/components/fx'

// "Community Speakers" section — search and discover other speakers.
export default function Community() {
  return (
    <Reveal>
      <SpeakerDirectory />
    </Reveal>
  )
}
