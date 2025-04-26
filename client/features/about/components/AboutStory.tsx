/**
 * Component that displays the story/mission section of the About page.
 */
export function AboutStory() {
  return (
    <div className="mb-10">
      <h1 className="text-4xl font-bold text-primary mb-6">Our Story</h1>
      <div className="rounded-large bg-content1 p-6 shadow-small backdrop-blur-md bg-opacity-85 border border-content2">
        <p className="text-default-600 mb-6">
          We started this project to help people discover local companies with powerful tools like
          interactive search and maps. Our mission is to connect communities with local businesses
          and provide resources that help both sides thrive.
        </p>
        <p className="text-default-600 mb-6">
          What began as a simple idea has grown into a comprehensive platform that serves thousands
          of users. We're constantly expanding our features and improving the experience based on
          community feedback.
        </p>
        <p className="text-default-600">
          Our team is passionate about supporting local economies and building technology that makes
          a real difference in how people discover and connect with businesses in their communities.
        </p>
      </div>
    </div>
  );
}
