<script lang="ts">
    import * as Avatar from "$lib/components/ui/avatar/index.js";
    import * as Card from "$lib/components/ui/card/index.js";
    import Navbar from "$lib/components/custom/Navbar.svelte";
    import Button from "$lib/components/ui/button/button.svelte";
    import * as Accordion from "$lib/components/ui/accordion/index.js";
    import { onMount } from "svelte";
    import { pageTitle } from "$lib/stores/title";
    pageTitle.set("About me")

    interface NowPlaying {
        item: {
            name: string;
            artists: { name: string }[];
            album: { images: { url: string }[] };
        };
    }

    let nowPlaying: NowPlaying | null = null;

    onMount(async () => {
        try {
            const response = await fetch('/api/spotify');
            if (response.ok) {
                nowPlaying = await response.json();
            }
        } catch (error) {
            console.error('Error fetching Spotify data:', error);
        }
    });
</script>

<Navbar />

<div class="flex flex-col justify-center items-center min-h-screen px-4">
  <div class="flex flex-wrap lg:flex-nowrap gap-8 justify-center max-w-screen-xl mx-auto mt-5">
    <!-- First Card -->
    <Card.Root class="bg-base-300 shadow-lg p-6 flex-1 min-w-[260px] max-w-[540px] w-full sm:w-auto">
      <Card.Header class="flex flex-col items-center justify-center space-y-2 text-center">
        <Avatar.Root class="size-32 m-5">
          <Avatar.Image src="/favicon.jpg" alt="@matyii" />
          <Avatar.Fallback>MK</Avatar.Fallback>
        </Avatar.Root>
        <Card.Title>Kristóf Mátyás</Card.Title>
        <Card.Description>20 years old. 🪐</Card.Description>
      </Card.Header>
      <Card.Content class="flex flex-col gap-3">
        <Button href="mailto:business@itsmatyii.fun" variant="default">Business enquiries</Button>
        <Button href="https://drive.google.com/file/d/1edMNHy80zorF55jnZJ3igLv9XpTS5Mm1/view" target="_blank" variant="default">
          Open my CV
        </Button>
      </Card.Content>
    </Card.Root>

    <!-- Second Card -->
    <Card.Root class="bg-base-300 shadow-lg p-6 flex-1 min-w-[260px] max-w-[540px] w-full sm:w-auto">
      <Card.Header class="text-center">
        <Card.Title>About Me</Card.Title>
      </Card.Header>
      <Card.Content class="space-y-4">
        <p>Hi there! My name is Kristóf Mátyás, and I’m a 20-year-old IT technician with a passion for all things tech.</p>
        <p>I specialize in system administration and networking, though I'm always open to new challenges. I’ve worked on projects with FiveM, GitLab, UniFi, and more, and I’ve really enjoyed learning and collaborating on them.</p>
        <p>When I’m not coding or tinkering with tech, you’ll find me outside spending time with my girlfriend or cruising around with her in my car, listening to music.</p>
        <p>For business enquiries, don’t hesitate to contact me via <a href="mailto:business@itsmatyii.fun" class="text-info underline underline-offset-4 transition-all hover:text-blue-400">e-mail.</a></p>
      </Card.Content>
    </Card.Root>

    <!-- Third Card -->
    <Card.Root class="bg-base-300 shadow-lg p-6 flex-1 min-w-[260px] max-w-[540px] w-full sm:w-auto">
      <Card.Header class="text-center">
        <Card.Title>Skills and Certifications</Card.Title>
      </Card.Header>
      <Card.Content class="space-y-4">
        <Accordion.Root type="single">
          <!-- General and IT Skills -->
          <Accordion.Item value="general-skills">
            <Accordion.Trigger class="font-semibold">General and IT Skills</Accordion.Trigger>
            <Accordion.Content>
              <ul class="list-disc pl-6 text-sm">
                <li>Calm problem-solving skills</li>
                <li>Microsoft Office - Intermediate</li>
                <li>Windows and Linux Administration - Intermediate</li>
                <li>Basic networking knowledge and acquaintance with the UniFi ecosystem</li>
              </ul>
            </Accordion.Content>
          </Accordion.Item>

          <!-- Languages -->
          <Accordion.Item value="languages">
            <Accordion.Trigger class="font-semibold">Languages</Accordion.Trigger>
            <Accordion.Content>
              <ul class="list-disc pl-6 text-sm">
                <li>Hungarian - Native</li>
                <li>English - B2</li>
                <li>Slovak - Intermediate</li>
              </ul>
            </Accordion.Content>
          </Accordion.Item>

          <!-- Certificates -->
          <Accordion.Item value="certificates">
            <Accordion.Trigger class="font-semibold">Certificates</Accordion.Trigger>
            <Accordion.Content>
              <ul class="list-disc pl-6 text-sm">
                <li>
                  ECDL - module M2, M3, M4, M6 and M7
                  <a
                    href="https://drive.google.com/file/d/1SObqxvhzIn_WlqRR7yRoK5FmCUUi450k/view"
                    target="_blank"
                    class="text-blue-400 hover:underline"
                  >[show]
                  </a>
                </li>
              </ul>
            </Accordion.Content>
          </Accordion.Item>

          <!-- Coding Setup -->
          <Accordion.Item value="coding-setup">
            <Accordion.Trigger class="font-semibold">Coding Setup</Accordion.Trigger>
            <Accordion.Content>
              <ul class="list-disc pl-6 text-sm">
                <li>MacBook Air M1 (8GB RAM, 256SSD)</li>
                <li>Xiaomi A27i (27", 100hz, 1080p)</li>
              </ul>
            </Accordion.Content>
          </Accordion.Item>
        </Accordion.Root>
      </Card.Content>
    </Card.Root>
  </div>
</div>