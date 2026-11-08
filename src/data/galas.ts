export interface ProjectGala {
    projectId: string;
    startsAt: string;
    endsAt?: string;
    youtubeLiveUrl?: string;
}

export const projectGalas: ProjectGala[] = [
    // Add a project gala below; use an ISO date with an explicit timezone:
    // {
    //     projectId: "new-project",
    //     startsAt: "2026-12-01T20:00:00+03:00",
    //     endsAt: "2026-12-01T22:00:00+03:00",
    //     youtubeLiveUrl: "https://www.youtube.com/live/VIDEO_ID",
    // },
];
